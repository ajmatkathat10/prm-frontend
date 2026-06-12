import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetProjectsQuery } from '@/store/services/projectApiSlice';
import { useGetResourcesQuery } from '@/store/services/resourceApiSlice';
import {
  useGetAllAllocationsQuery,
  useCreateAllocationMutation,
  useEndAllocationMutation,
} from '@/store/services/allocationApiSlice';
import { STRINGS } from '@/constants/strings';
import { styles } from './allocateResourcePage.styles';

export default function AllocateResourcePage() {
  const location = useLocation();
  const state = location.state as { projectId?: string; resourceId?: string } | null;

  const { data: projects, isLoading: loadingProjects } = useGetProjectsQuery();
  const { data: resources, isLoading: loadingResources } = useGetResourcesQuery();

  const [createAllocation, { isLoading: creating }] = useCreateAllocationMutation();
  const [endAllocation, { isLoading: ending }] = useEndAllocationMutation();

  const [selectedProjectId, setSelectedProjectId] = useState(state?.projectId || '');
  const [selectedResourceId, setSelectedResourceId] = useState(state?.resourceId || '');
  const [utilisation, setUtilisation] = useState(50);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [endProjectId, setEndProjectId] = useState('');

  const { data: endAllocations, isLoading: loadingEndAllocations, refetch: refetchEndAllocations } = useGetAllAllocationsQuery(
    endProjectId ? { projectId: endProjectId } : undefined,
    { skip: !endProjectId }
  );

  const activeProjects = projects
    ? projects.filter((p) => p.status === 'ACTIVE' || p.status === 'PLANNED')
    : [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedProjectId || !selectedResourceId || !fromDate || !toDate) {
      setErrorMsg('All fields are mandatory');
      return;
    }

    try {
      await createAllocation({
        resourceId: selectedResourceId,
        projectId: selectedProjectId,
        utilisationPercent: Number(utilisation),
        fromDate,
        toDate,
      }).unwrap();

      setSuccessMsg('Resource allocated successfully!');
      setSelectedResourceId('');
      setUtilisation(50);
      setFromDate('');
      setToDate('');
      if (endProjectId === selectedProjectId) {
        refetchEndAllocations();
      }
    } catch (err: unknown) {
      const errorPayload = err as { data?: { error?: string } };
      setErrorMsg(errorPayload?.data?.error || 'Failed to create allocation. Check date ranges and capacity limits.');
    }
  };

  const handleEnd = async (allocId: string) => {
    if (!window.confirm('Are you sure you want to end this allocation immediately?')) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await endAllocation(allocId).unwrap();
      setSuccessMsg('Allocation ended successfully!');
      if (endProjectId) {
        refetchEndAllocations();
      }
    } catch (err: unknown) {
      const errorPayload = err as { data?: { error?: string } };
      setErrorMsg(errorPayload?.data?.error || 'Failed to end allocation');
    }
  };

  if (loadingProjects || loadingResources) {
    return <div>{STRINGS.DASHBOARD.LOADING}</div>;
  }

  const activeEndAllocations = endAllocations
    ? endAllocations.filter((a) => a.status === 'ACTIVE')
    : [];

  return (
    <div style={styles.container}>
      <h1>{STRINGS.DASHBOARD.MANAGER_OPTION_ALLOCATE_LABEL}</h1>
      <p style={styles.headerSubtitle}>
        Allocate team resources to projects, set utilization targets, or end active project allocations.
      </p>

      {errorMsg && (
        <div style={styles.errorBanner}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={styles.successBanner}>
          {successMsg}
        </div>
      )}

      <div style={styles.gridOneCol}>
        <div className="card">
          <h2>Create New Allocation</h2>
          <form onSubmit={handleCreate} style={styles.formContainer}>
            <div style={styles.gridTwoCol}>
              <div>
                <label style={styles.fieldLabel}>Select Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  style={styles.widthFullInput}
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {activeProjects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={styles.fieldLabel}>Select Resource</label>
                <select
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  style={styles.widthFullInput}
                  required
                >
                  <option value="">-- Choose Employee --</option>
                  {resources?.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.fullName} ({r.designation})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.gridThreeCol}>
              <div>
                <label style={styles.fieldLabel}>Utilisation %</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={utilisation}
                  onChange={(e) => setUtilisation(Number(e.target.value))}
                  style={styles.widthFullInput}
                  required
                />
              </div>

              <div>
                <label style={styles.fieldLabel}>From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={styles.widthFullInput}
                  required
                />
              </div>

              <div>
                <label style={styles.fieldLabel}>To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={styles.widthFullInput}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              style={styles.submitButton(creating)}
            >
              {creating ? 'Allocating...' : 'Confirm Allocation'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>End an Existing Allocation</h2>
          <div style={styles.cardSection}>
            <label style={styles.fieldLabel}>Select Project</label>
            <select
              value={endProjectId}
              onChange={(e) => setEndProjectId(e.target.value)}
              style={styles.projectSelectWithMargin}
            >
              <option value="">-- Choose Project --</option>
              {activeProjects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            {endProjectId && (
              <div>
                {loadingEndAllocations ? (
                  <div>Loading project allocations...</div>
                ) : activeEndAllocations.length === 0 ? (
                  <p style={styles.noAllocationsMessage}>No active allocations found on this project.</p>
                ) : (
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.th}>Employee</th>
                        <th style={styles.th}>Utilisation</th>
                        <th style={styles.th}>Dates</th>
                        <th style={styles.thRightAligned}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeEndAllocations.map((alloc) => (
                        <tr key={alloc._id} style={styles.tableBodyRow}>
                          <td style={styles.tdEmployeeName}>{alloc.resourceId.fullName}</td>
                          <td style={styles.tdUtil}>{alloc.utilisationPercent}%</td>
                          <td style={styles.tdDates}>
                            {new Date(alloc.fromDate).toLocaleDateString()} to{' '}
                            {new Date(alloc.toDate).toLocaleDateString()}
                          </td>
                          <td style={styles.tdAction}>
                            <button
                              onClick={() => handleEnd(alloc._id)}
                              disabled={ending}
                              style={styles.endAllocationButton}
                            >
                              End Allocation
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
