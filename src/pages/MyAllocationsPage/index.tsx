import { useGetMyResourceQuery } from '@/store/services/resourceApiSlice';
import { useGetAllAllocationsQuery } from '@/store/services/allocationApiSlice';
import { STRINGS } from '@/constants/strings';
import { styles } from './myAllocationsPage.styles';

export default function MyAllocationsPage() {
  const { data: resource, isLoading: loadingResource } = useGetMyResourceQuery();
  const { data: allocations, isLoading: loadingAllocations } = useGetAllAllocationsQuery(
    resource ? { resourceId: resource._id } : undefined,
    { skip: !resource }
  );

  if (loadingResource || loadingAllocations) {
    return <div>{STRINGS.DASHBOARD.LOADING}</div>;
  }

  const activeAllocations = allocations
    ? allocations.filter((a) => a.status === 'ACTIVE')
    : [];

  const totalUtilisation = activeAllocations.reduce((sum, a) => sum + a.utilisationPercent, 0);

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
      <h1>{STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_ALLOCATIONS_LABEL}</h1>
      <p style={styles.headerSubtitle}>
        Review your active project allocations, target dates, and weekly utilization levels.
      </p>

      <div className="card" style={styles.summaryCard}>
        <h3 style={styles.summaryTitle}>Total Allocated Capacity</h3>
        <p style={styles.summaryValue}>
          {totalUtilisation}%
        </p>
        <span style={styles.summaryFooter}>
          Maximum weekly hours: 40 hrs (Your allocated capacity is {Math.round((totalUtilisation / 100) * 40)} hrs/week)
        </span>
      </div>

      {activeAllocations.length === 0 ? (
        <div className="card" style={styles.emptyCard}>
          <p style={styles.emptyText}>You are not currently allocated to any active projects.</p>
        </div>
      ) : (
        <div className="space-y">
          {activeAllocations.map((alloc) => (
            <div key={alloc._id} className="card">
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.projectTitle}>{alloc.projectId.name}</h3>
                  <span style={styles.metaText}>
                    Allocated Percentage: <strong>{alloc.utilisationPercent}%</strong>
                  </span>
                  <div style={styles.dateMetaText}>
                    From: <strong>{formatDate(alloc.fromDate)}</strong> to{' '}
                    <strong>{formatDate(alloc.toDate)}</strong>
                  </div>
                </div>
                <span
                  style={styles.badge}
                >
                  {alloc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
