import { useState } from 'react';
import { useGetTimesheetsQuery } from '@/store/services/timesheetApiSlice';
import { useGetResourcesQuery } from '@/store/services/resourceApiSlice';
import { useGetAllAllocationsQuery } from '@/store/services/allocationApiSlice';
import { STRINGS } from '@/constants/strings';
import { styles } from './teamTimesheetsPage.styles';

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

export default function TeamTimesheetsPage() {
  const initialWeeks = getMondays();
  const [weeks] = useState<string[]>(initialWeeks);
  const [selectedWeek, setSelectedWeek] = useState<string>(initialWeeks[0] || '');

  const { data: timesheets, isLoading: loadingTimesheets } = useGetTimesheetsQuery(
    selectedWeek ? { weekStart: selectedWeek } : undefined,
    { skip: !selectedWeek }
  );

  const { data: resources } = useGetResourcesQuery();
  const { data: allocations } = useGetAllAllocationsQuery();

  if (loadingTimesheets) {
    return <div>{STRINGS.DASHBOARD.LOADING}</div>;
  }

  const getFlatRows = () => {
    if (!timesheets) return [];

    const rows: {
      id: string;
      employeeName: string;
      projectName: string;
      hours: number;
      status: string;
    }[] = [];

    timesheets.forEach((ts) => {
      const emp = resources?.find((r) => r._id === (typeof ts.resourceId === 'object' && ts.resourceId ? ts.resourceId._id : ts.resourceId));
      const employeeName = emp ? emp.fullName : 'Unknown Employee';

      if (ts.status === 'SUBMITTED') {
        ts.entries.forEach((e, idx) => {
          const pName = e.projectId?.name || 'Project';
          rows.push({
            id: `${ts._id}_${idx}`,
            employeeName,
            projectName: pName,
            hours: e.hoursWorked,
            status: 'SUBMITTED',
          });
        });
      } else if (ts.status === 'MISSED') {
        const weekStart = new Date(ts.weekStart);
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        weekEnd.setHours(23, 59, 59, 999);

        const activeAllocs = allocations?.filter((a) => {
          const rId = typeof ts.resourceId === 'object' && ts.resourceId ? ts.resourceId._id : ts.resourceId;
          const aResourceId = a.resourceId._id ? a.resourceId._id.toString() : a.resourceId.toString();
          const from = new Date(a.fromDate);
          const to = new Date(a.toDate);
          return aResourceId === rId && a.status === 'ACTIVE' && from <= weekEnd && to >= weekStart;
        }) || [];

        if (activeAllocs.length === 0) {
          rows.push({
            id: ts._id,
            employeeName,
            projectName: 'No allocations active',
            hours: 0,
            status: 'MISSED',
          });
        } else {
          activeAllocs.forEach((alloc, idx) => {
            rows.push({
              id: `${ts._id}_missed_${idx}`,
              employeeName,
              projectName: alloc.projectId.name,
              hours: 0,
              status: 'MISSED',
            });
          });
        }
      }
    });

    return rows;
  };

  const flatRows = getFlatRows();

  return (
    <div style={styles.container}>
      <h1>{STRINGS.DASHBOARD.MANAGER_OPTION_TIMESHEETS_LABEL}</h1>
      <p style={styles.headerSubtitle}>
        Track weekly hours logged and identify missed log logs on your team.
      </p>

      <div className="card" style={styles.filterCard}>
        <label style={styles.filterLabel}>Filter by Week Start</label>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
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

      <div className="card">
        <h2>Timesheet Logging for Selected Week</h2>
        {flatRows.length === 0 ? (
          <p style={styles.emptyMessage}>
            No timesheet records submitted or flagged for this week.
          </p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Project</th>
                <th style={styles.thCentered}>Logged Hours</th>
                <th style={styles.thRightAligned}>Status</th>
              </tr>
            </thead>
            <tbody>
              {flatRows.map((row) => {
                const isMissed = row.status === 'MISSED';
                return (
                  <tr key={row.id} style={styles.tableBodyRow}>
                    <td style={styles.tdEmployeeName}>{row.employeeName}</td>
                    <td style={styles.tdProject}>{row.projectName}</td>
                    <td style={styles.tdHours}>{row.hours} hrs</td>
                    <td style={styles.tdStatus}>
                      <span
                        style={styles.badge(isMissed)}
                      >
                        {row.status} {isMissed && '⚠'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
