import { useState } from 'react';
import { useGetResourcesQuery, useRestoreTimesheetAccessMutation } from '@/store/services/resourceApiSlice';
import { useGetAllAllocationsQuery } from '@/store/services/allocationApiSlice';
import { useGetTimesheetsQuery } from '@/store/services/timesheetApiSlice';
import { STRINGS } from '@/constants/strings';
import { styles } from './teamResourcesPage.styles';

export default function TeamResourcesPage() {
  const { data: resources, isLoading: loadingResources } = useGetResourcesQuery();
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [restoreAccess, { isLoading: restoring }] = useRestoreTimesheetAccessMutation();

  const handleRestoreAccess = async (id: string) => {
    try {
      await restoreAccess(id).unwrap();
    } catch (err) {
      console.error('Failed to restore timesheet access:', err);
    }
  };

  const { data: drillAllocations, isLoading: loadingDrillAlloc } = useGetAllAllocationsQuery(
    selectedResourceId ? { resourceId: selectedResourceId } : undefined,
    { skip: !selectedResourceId }
  );

  const { data: drillTimesheets, isLoading: loadingDrillTs } = useGetTimesheetsQuery(
    selectedResourceId ? { resourceId: selectedResourceId } : undefined,
    { skip: !selectedResourceId }
  );

  if (loadingResources) {
    return <div>{STRINGS.DASHBOARD.LOADING}</div>;
  }

  const teamResources = resources || [];
  const benchResources = teamResources.filter((r) => r.status === 'BENCH');
  const activeResources = teamResources.filter((r) => r.status === 'ALLOCATED');

  const selectedResource = teamResources.find((r) => r._id === selectedResourceId);

  const getRecentActivityTags = () => {
    if (!drillTimesheets) return [];
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const tagsSet = new Set<string>();
    drillTimesheets
      .filter((ts) => new Date(ts.weekStart) >= fourWeeksAgo && ts.status === 'SUBMITTED')
      .forEach((ts) => {
        ts.entries.forEach((e) => {
          e.activityTags.forEach((t) => tagsSet.add(t));
        });
      });

    return Array.from(tagsSet);
  };

  const activityTags = getRecentActivityTags();

  return (
    <div style={styles.container}>
      <h1>{STRINGS.DASHBOARD.MANAGER_OPTION_RESOURCES_LABEL}</h1>
      <p style={styles.headerSubtitle}>
        Track your direct reports, bench availability, and project commitments.
      </p>

      {selectedResource ? (
        <div className="card">
          <button
            onClick={() => setSelectedResourceId(null)}
            style={styles.backButton}
          >
            ← Back to List
          </button>
          <h2>Drill down: {selectedResource.fullName}</h2>
          {selectedResource.timesheetAccessFrozen && (
            <div style={styles.frozenAlert}>
              <span style={styles.frozenAlertText}>
                ⚠️ This employee's timesheet submission access is frozen due to missed timesheets.
              </span>
              <button
                onClick={() => handleRestoreAccess(selectedResource._id)}
                disabled={restoring}
                style={styles.frozenRestoreButton(restoring)}
              >
                {restoring ? 'Restoring...' : 'Restore Timesheet Access'}
              </button>
            </div>
          )}
          <div style={styles.drilldownGrid}>
            <div>
              <span style={styles.drilldownLabel}>Designation</span>
              <strong>{selectedResource.designation}</strong>
            </div>
            <div>
              <span style={styles.drilldownLabel}>Email</span>
              <strong>{selectedResource.email}</strong>
            </div>
            <div>
              <span style={styles.drilldownLabel}>Status</span>
              <strong style={styles.drilldownStatus(selectedResource.status)}>
                {selectedResource.status}
              </strong>
            </div>
            <div>
              <span style={styles.drilldownLabel}>Skills</span>
              <strong>
                {selectedResource.skills.map((s) => (typeof s.skillId === 'object' && s.skillId ? s.skillId.name : '')).filter(Boolean).join(', ') || 'None'}
              </strong>
            </div>
          </div>

          <div style={styles.section}>
            <h3>Active Allocations</h3>
            {loadingDrillAlloc ? (
              <div>Loading allocations...</div>
            ) : !drillAllocations || drillAllocations.filter(a => a.status === 'ACTIVE').length === 0 ? (
              <p style={styles.emptyText}>No active allocations found.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>Project</th>
                    <th style={styles.th}>Utilisation</th>
                    <th style={styles.th}>From</th>
                    <th style={styles.th}>To</th>
                  </tr>
                </thead>
                <tbody>
                  {drillAllocations.filter(a => a.status === 'ACTIVE').map((alloc) => (
                    <tr key={alloc._id} style={styles.tableBodyRow}>
                      <td style={styles.tdName}>{alloc.projectId.name}</td>
                      <td style={styles.tdValue}>{alloc.utilisationPercent}%</td>
                      <td style={styles.tdValue}>{new Date(alloc.fromDate).toLocaleDateString()}</td>
                      <td style={styles.tdValue}>{new Date(alloc.toDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={styles.section}>
            <h3>Recent Activity Tags (Last 4 Weeks)</h3>
            {loadingDrillTs ? (
              <div>Loading recent tags...</div>
            ) : activityTags.length === 0 ? (
              <p style={styles.emptyText}>No activity logs found for the last 4 weeks.</p>
            ) : (
              <div style={styles.tagsContainer}>
                {activityTags.map((tag) => (
                  <span
                    key={tag}
                    style={styles.activityTag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.benchGrid}>
          <div className="card">
            <h2 style={styles.benchHeader}>On Bench ({benchResources.length})</h2>
            {benchResources.length === 0 ? (
              <p style={styles.emptyTextBench}>No team members are currently on bench.</p>
            ) : (
              <table style={styles.benchTable}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.benchTh}>Name</th>
                    <th style={styles.benchTh}>Designation</th>
                    <th style={styles.benchTh}>Skills</th>
                    <th style={styles.benchThRight}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {benchResources.map((res) => (
                    <tr key={res._id} style={styles.tableBodyRow}>
                      <td style={styles.benchTdBold}>
                        {res.fullName}
                        {res.timesheetAccessFrozen && (
                          <span style={styles.frozenBadge}>
                            Frozen
                          </span>
                        )}
                      </td>
                      <td style={styles.benchTd}>{res.designation}</td>
                      <td style={styles.benchTd}>
                        {res.skills.map((s) => (typeof s.skillId === 'object' && s.skillId ? s.skillId.name : '')).filter(Boolean).join(', ') || '-'}
                      </td>
                      <td style={styles.benchTdRight}>
                        <div style={styles.actionsWrapper}>
                          {res.timesheetAccessFrozen && (
                            <button
                              onClick={() => handleRestoreAccess(res._id)}
                              disabled={restoring}
                              style={styles.restoreAccessButton(restoring)}
                            >
                              Restore Access
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedResourceId(res._id)}
                            style={styles.drillDetailsButton}
                          >
                            Drill Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h2 style={styles.benchHeader}>Active Employees ({activeResources.length})</h2>
            {activeResources.length === 0 ? (
              <p style={styles.emptyTextBench}>No active allocations currently.</p>
            ) : (
              <table style={styles.benchTable}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.benchTh}>Name</th>
                    <th style={styles.benchTh}>Designation</th>
                    <th style={styles.benchThCentered}>Utilisation</th>
                    <th style={styles.benchThRight}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeResources.map((res) => (
                    <tr key={res._id} style={styles.tableBodyRow}>
                      <td style={styles.benchTdBold}>
                        {res.fullName}
                        {res.timesheetAccessFrozen && (
                          <span style={styles.frozenBadge}>
                            Frozen
                          </span>
                        )}
                      </td>
                      <td style={styles.benchTd}>{res.designation}</td>
                      <td style={styles.benchTdCentered}>
                        <span
                          style={styles.allocatedBadge}
                        >
                          Allocated
                        </span>
                      </td>
                      <td style={styles.benchTdRight}>
                        <div style={styles.actionsWrapper}>
                          {res.timesheetAccessFrozen && (
                            <button
                              onClick={() => handleRestoreAccess(res._id)}
                              disabled={restoring}
                              style={styles.restoreAccessButton(restoring)}
                            >
                              Restore Access
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedResourceId(res._id)}
                            style={styles.drillDetailsButton}
                          >
                            Drill Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
