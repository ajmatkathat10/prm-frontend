import { useState } from 'react';
import { useGetMyResourceQuery } from '@/store/services/resourceApiSlice';
import { useGetTimesheetsQuery } from '@/store/services/timesheetApiSlice';
import { STRINGS } from '@/constants/strings';
import { styles } from './myTimesheetsPage.styles';

export default function MyTimesheetsPage() {
  const { data: resource, isLoading: loadingResource } = useGetMyResourceQuery();
  const { data: timesheets, isLoading: loadingTimesheets } = useGetTimesheetsQuery(
    resource ? { resourceId: resource._id } : undefined,
    { skip: !resource }
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loadingResource || loadingTimesheets) {
    return <div>{STRINGS.DASHBOARD.LOADING}</div>;
  }

  const sortedTimesheets = timesheets
    ? [...timesheets].sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime())
    : [];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div style={styles.container}>
      <h1>{STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_TIMESHEETS_LABEL}</h1>
      <p style={styles.headerSubtitle}>
        Review your weekly submission history, total hours, and log status states.
      </p>

      {sortedTimesheets.length === 0 ? (
        <div className="card" style={styles.emptyCard}>
          <p style={styles.emptyText}>You have no timesheets registered in the system.</p>
        </div>
      ) : (
        <div className="space-y">
          {sortedTimesheets.map((ts) => {
            const isMissed = ts.status === 'MISSED';
            const isExpanded = expandedId === ts._id;

            return (
              <div
                key={ts._id}
                className="card"
                style={styles.cardContainer(isMissed)}
              >
                <div
                  style={styles.cardHeader}
                  onClick={() => setExpandedId(isExpanded ? null : ts._id)}
                >
                  <div>
                    <h3 style={styles.title}>Week of {formatDate(ts.weekStart)}</h3>
                    <span style={styles.metaText}>
                      Logged Hours: <strong>{ts.totalHours} hrs</strong>
                    </span>
                  </div>
                  <div style={styles.badgeAndButtonRow}>
                    <span
                      style={styles.badge(isMissed)}
                    >
                      {ts.status} {isMissed && '⚠'}
                    </span>
                    <button
                      style={styles.toggleButton}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div style={styles.expandedSection}>
                    {isMissed ? (
                      <p style={styles.missedWarning}>
                        This timesheet was flagged as missed by the system scheduler because you did not submit hours for this week.
                      </p>
                    ) : (
                      <table style={styles.table}>
                        <thead>
                          <tr style={styles.tableHeaderRow}>
                            <th style={styles.th}>Project</th>
                            <th style={styles.th}>Hours</th>
                            <th style={styles.th}>Activity Tags</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ts.entries.map((entry, idx) => {
                            const pName = entry.projectId?.name || 'Project';
                            return (
                              <tr key={idx} style={styles.tableBodyRow}>
                                <td style={styles.tdProjectName}>{pName}</td>
                                <td style={styles.tdHours}>{entry.hoursWorked} hrs</td>
                                <td style={styles.tdTags}>
                                  <div style={styles.tagsWrapper}>
                                    {entry.activityTags.map((tag) => (
                                      <span
                                        key={tag}
                                        style={styles.tag}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
