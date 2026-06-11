import { useState } from 'react';
import { useGetAllAllocationsQuery } from '@/store/services/allocationApiSlice';

export default function AllocationsPage() {
  const [empSearch, setEmpSearch] = useState('');
  const [projSearch, setProjSearch] = useState('');

  const { data: allocations = [], isLoading } = useGetAllAllocationsQuery();

  // Filter allocations locally for fast responsiveness
  const filteredAllocations = allocations.filter((alloc) => {
    const resourceName = alloc.resourceId?.fullName || '';
    const projectName = alloc.projectId?.name || '';
    
    const matchesEmp = resourceName.toLowerCase().includes(empSearch.toLowerCase().trim());
    const matchesProj = projectName.toLowerCase().includes(projSearch.toLowerCase().trim());
    
    return matchesEmp && matchesProj;
  });

  return (
    <div>
      {/* Header */}
      <div>
        <h1>View All Allocations</h1>
      </div>

      {/* Filter Options */}
      <div className="card" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <strong>Filters:</strong>
        </div>

        {/* Employee Search Input */}
        <div>
          <label style={{ display: 'inline', marginRight: '5px' }}>Resource:</label>
          <input
            type="text"
            placeholder="Search by Resource..."
            value={empSearch}
            onChange={(e) => setEmpSearch(e.target.value)}
          />
        </div>

        {/* Project Search Input */}
        <div>
          <label style={{ display: 'inline', marginRight: '5px' }}>Project:</label>
          <input
            type="text"
            placeholder="Search by Project..."
            value={projSearch}
            onChange={(e) => setProjSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Matrix Table */}
      {isLoading ? (
        <div style={{ padding: "20px", color: "#666" }}>Loading allocations data...</div>
      ) : filteredAllocations.length === 0 ? (
        <div style={{ padding: "20px", color: "#666" }}>No active or historic allocations found.</div>
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
                <td style={{ fontWeight: 'bold' }}>
                  {alloc.resourceId?.fullName || 'Deactivated Resource'}
                </td>
                <td style={{ color: '#007700', fontWeight: 'bold' }}>
                  {alloc.projectId?.name || 'Archived Project'}
                </td>
                <td style={{ fontWeight: 'bold' }}>
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
                    style={{
                      color: alloc.status === 'ACTIVE' ? '#007700' : '#888888',
                      fontWeight: 'bold'
                    }}
                  >
                    {alloc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Summary Stat */}
      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Showing {filteredAllocations.length} of {allocations.length} allocations.
      </div>
    </div>
  );
}

