import { useState } from 'react';
import { useGetMyResourceQuery } from '@/store/services/resourceApiSlice';
import { useGetAllAllocationsQuery } from '@/store/services/allocationApiSlice';
import { useSubmitTimesheetMutation, useGetTimesheetsQuery } from '@/store/services/timesheetApiSlice';
import { STRINGS } from '@/constants/strings';
import { styles } from './submitTimesheetPage.styles';

const ACTIVITY_TAGS = [
  'Backend API Development',
  'Microservices / Architecture',
  'Database Design & Queries',
  'WebSocket / Real-time Features',
  'Frontend Development',
  'Code Review / Mentoring',
  'Bug Fixing',
  'DevOps / Deployment',
  'Testing & QA',
  'Documentation',
];

const getMondays = (): string[] => {
  const mondays: string[] = [];
  const current = new Date();
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(current.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  for (let i = 0; i < 4; i++) {
    const copy = new Date(monday);
    mondays.push(copy.toISOString().split('T')[0]);
    monday.setDate(monday.getDate() - 7);
  }
  return mondays;
};

export default function SubmitTimesheetPage() {
  const { data: resource, isLoading: loadingResource } = useGetMyResourceQuery();
  const isFrozen = resource?.timesheetAccessFrozen || false;
  const { data: allocations, isLoading: loadingAllocations } = useGetAllAllocationsQuery(
    resource ? { resourceId: resource._id } : undefined,
    { skip: !resource }
  );

  const [submitTimesheet, { isLoading: submitting }] = useSubmitTimesheetMutation();
  const { refetch: refetchTimesheets } = useGetTimesheetsQuery(
    resource ? { resourceId: resource._id } : undefined,
    { skip: !resource }
  );

  const initialWeeks = getMondays();
  const [weeks] = useState<string[]>(initialWeeks);
  const [selectedWeek, setSelectedWeek] = useState<string>(initialWeeks[0]);
  const [hours, setHours] = useState<Record<string, number>>({});
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({});
  const [customTags, setCustomTags] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const getWeekAllocations = () => {
    if (!allocations || !selectedWeek) return [];
    const selectedMonday = new Date(selectedWeek);
    const selectedSunday = new Date(selectedMonday.getTime() + 6 * 24 * 60 * 60 * 1000);
    selectedSunday.setHours(23, 59, 59, 999);

    return allocations.filter((a) => {
      const from = new Date(a.fromDate);
      const to = new Date(a.toDate);
      return a.status === 'ACTIVE' && from <= selectedSunday && to >= selectedMonday;
    });
  };

  const activeWeekAllocations = getWeekAllocations();

  const handleHourChange = (projectId: string, val: number) => {
    setHours((prev) => ({ ...prev, [projectId]: val }));
  };

  const handleTagToggle = (projectId: string, tag: string) => {
    setSelectedTags((prev) => {
      const current = prev[projectId] || [];
      const updated = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { ...prev, [projectId]: updated };
    });
  };

  const handleCustomTagChange = (projectId: string, val: string) => {
    setCustomTags((prev) => ({ ...prev, [projectId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const entries = activeWeekAllocations.map((alloc) => {
        const projId = alloc.projectId._id;
        const pTags = [...(selectedTags[projId] || [])];
        if (customTags[projId]?.trim()) {
          pTags.push(customTags[projId].trim());
        }
        return {
          projectId: projId,
          hoursWorked: Number(hours[projId] || 0),
          activityTags: pTags,
        };
      });

      await submitTimesheet({
        weekStart: selectedWeek,
        entries,
      }).unwrap();

      setSuccessMessage('Timesheet submitted successfully!');
      refetchTimesheets();
    } catch (err: unknown) {
      const errorPayload = err as { data?: { error?: string } };
      setErrorMessage(errorPayload?.data?.error || 'Failed to submit timesheet. Check allocation hour limits.');
    }
  };

  if (loadingResource || loadingAllocations) {
    return <div>{STRINGS.DASHBOARD.LOADING}</div>;
  }

  return (
    <div style={styles.container}>
      <h1>{STRINGS.DASHBOARD.EMPLOYEE_OPTION_SUBMIT_TIMESHEET_LABEL}</h1>
      <p style={styles.headerSubtitle}>
        Log your weekly hours and activity tags for projects you are allocated to.
      </p>

      {isFrozen && (
        <div style={styles.frozenBanner}>
          ⚠️ Your timesheet submission access has been frozen. Please contact your reporting manager to restore access.
        </div>
      )}

      <div className="card" style={styles.filterCard}>
        <label style={styles.filterLabel}>
          Select Week Start (Monday)
        </label>
        <select
          value={selectedWeek}
          disabled={isFrozen}
          onChange={(e) => {
            setSelectedWeek(e.target.value);
            setHours({});
            setSelectedTags({});
            setCustomTags({});
            setErrorMessage('');
            setSuccessMessage('');
          }}
          style={styles.filterSelect}
        >
          {weeks.map((w) => {
            const d = new Date(w);
            const formatted = d.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            return (
              <option key={w} value={w}>
                {formatted}
              </option>
            );
          })}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y">
        {activeWeekAllocations.length === 0 ? (
          <div className="card" style={styles.emptyCard}>
            <p style={styles.emptyText}>
              You do not have any active allocations for this week. No timesheet submission is required.
            </p>
          </div>
        ) : (
          activeWeekAllocations.map((alloc, idx) => {
            const projId = alloc.projectId._id;
            const maxProjectHours = (alloc.utilisationPercent / 100) * 40;
            return (
              <div key={projId} className="card" style={styles.projectCard}>
                <h3 style={styles.projectTitle}>
                  Project {idx + 1}: {alloc.projectId.name}
                </h3>
                <p style={styles.projectMeta}>
                  Allocation: <strong>{alloc.utilisationPercent}%</strong> | Max Allowed:{' '}
                  <strong>{maxProjectHours} hrs</strong>
                </p>

                <div style={styles.inputSection}>
                  <label style={styles.inputLabel}>
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={maxProjectHours}
                    step="0.5"
                    value={hours[projId] ?? ''}
                    onChange={(e) => handleHourChange(projId, Number(e.target.value))}
                    required
                    disabled={isFrozen}
                    style={styles.numberInput}
                  />
                </div>

                <div>
                  <label style={styles.inputLabel}>
                    Activity Tags
                  </label>
                  <div style={styles.tagsContainer}>
                    {ACTIVITY_TAGS.map((tag) => (
                      <label key={tag} style={styles.tagLabel}>
                        <input
                          type="checkbox"
                          checked={selectedTags[projId]?.includes(tag) || false}
                          disabled={isFrozen}
                          onChange={() => handleTagToggle(projId, tag)}
                        />
                        {tag}
                      </label>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Other custom tag (comma separated)..."
                    value={customTags[projId] ?? ''}
                    disabled={isFrozen}
                    onChange={(e) => handleCustomTagChange(projId, e.target.value)}
                    style={styles.customTagInput}
                  />
                </div>
              </div>
            );
          })
        )}

        {errorMessage && (
          <div style={styles.errorBanner}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={styles.successBanner}>
            {successMessage}
          </div>
        )}

        {activeWeekAllocations.length > 0 && (
          <button
            type="submit"
            disabled={submitting || isFrozen}
            style={styles.submitButton(isFrozen, submitting)}
          >
            {submitting ? 'Submitting...' : 'Submit Timesheet'}
          </button>
        )}
      </form>
    </div>
  );
}
