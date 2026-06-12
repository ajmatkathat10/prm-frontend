import { useState } from 'react';
import { useGetAllAllocationsQuery } from '@/store/services/allocationApiSlice';
import { styles } from './allocationsPage.styles';

export default function AllocationsPage() {
  const [empSearch, setEmpSearch] = useState('');
  const [projSearch, setProjSearch] = useState('');

  const { data: allocations = [], isLoading } = useGetAllAllocationsQuery();

  const filteredAllocations = allocations.filter((alloc) => {
    const resourceName = alloc.resourceId?.fullName || '';
    const projectName = alloc.projectId?.name || '';
    
    const matchesEmp = resourceName.toLowerCase().includes(empSearch.toLowerCase().trim());
    const matchesProj = projectName.toLowerCase().includes(projSearch.toLowerCase().trim());
    
    return matchesEmp && matchesProj;
  });

  return (
    <div>
      <div>
        <h1>View All Allocations</h1>
      </div>

      <div className="card" style={styles.filterRow}>
        <div>
          <strong>Filters:</strong>
        </div>

        <div>
          <label style={styles.inlineLabel}>Resource:</label>
          <input
            type="text"
            placeholder="Search by Resource..."
            value={empSearch}
            onChange={(e) => setEmpSearch(e.target.value)}
          />
        </div>

        <div>
          <label style={styles.inlineLabel}>Project:</label>
          <input
            type="text"
            placeholder="Search by Project..."
            value={projSearch}
            onChange={(e) => setProjSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div style={styles.loadingOrEmpty}>Loading allocations data...</div>
      ) : filteredAllocations.length === 0 ? (
        <div style={styles.loadingOrEmpty}>No active or historic allocations found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Project</th>
              <th>Utilisation</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllocations.map((alloc) => (
              <tr key={alloc._id}>
                <td style={styles.resourceCell}>
                  {alloc.resourceId?.fullName || 'Deactivated Resource'}
                </td>
                <td style={styles.projectCell}>
                  {alloc.projectId?.name || 'Archived Project'}
                </td>
                <td style={styles.utilizationCell}>
                  {alloc.utilisationPercent}%
                </td>
                <td>
                  {new Date(alloc.fromDate).toLocaleDateString()}
                </td>
                <td>
                  {new Date(alloc.toDate).toLocaleDateString()}
                </td>
                <td>
                  <span
                    style={styles.statusText(alloc.status === 'ACTIVE')}
                  >
                    {alloc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={styles.summaryFooter}>
        Showing {filteredAllocations.length} of {allocations.length} allocations.
      </div>
    </div>
  );
}
