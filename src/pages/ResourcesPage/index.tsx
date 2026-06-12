import { useState } from 'react';
import {
  useGetResourcesQuery,
  useDeactivateResourceMutation,
  useAddResourceSkillMutation,
  useUpdateResourceSkillMutation,
  useRemoveResourceSkillMutation,
  useAssignManagerMutation,
} from '@/store/services/resourceApiSlice';
import { useGetUsersQuery } from '@/store/services/userApiSlice';
import { useAuth } from '@/hooks/useAuth';
import type { Resource, Skill } from '@/types/resource';
import { styles } from './resourcesPage.styles';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'assign'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { user: currentUser } = useAuth();

  const { data: resources = [], isLoading: isResLoading, refetch: refetchResources } = useGetResourcesQuery({
    status: statusFilter || undefined,
  });

  const { data: users = [] } = useGetUsersQuery();

  const [deactivateResource] = useDeactivateResourceMutation();
  const [addSkill] = useAddResourceSkillMutation();
  const [updateSkill] = useUpdateResourceSkillMutation();
  const [removeSkill] = useRemoveResourceSkillMutation();
  const [assignManager] = useAssignManagerMutation();

  const [selectedRes, setSelectedRes] = useState<Resource | null>(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState<Resource | null>(null);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'QA' | 'OTHER'>('BACKEND');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');

  const [assignEmpUserId, setAssignEmpUserId] = useState('');
  const [assignMgrUserId, setAssignMgrUserId] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [assignError, setAssignError] = useState('');

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes || !newSkillName.trim()) return;

    try {
      const updated = await addSkill({
        resourceId: selectedRes._id,
        name: newSkillName.trim(),
        category: newSkillCategory,
        proficiency: newSkillProficiency,
      }).unwrap();
      
      setSelectedRes(updated);
      setNewSkillName('');
      refetchResources();
    } catch {
      void 0;
    }
  };

  const handleUpdateSkill = async (skillId: string, prof: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => {
    if (!selectedRes) return;
    try {
      const updated = await updateSkill({
        resourceId: selectedRes._id,
        skillId,
        proficiency: prof,
      }).unwrap();
      
      setSelectedRes(updated);
      refetchResources();
    } catch {
      void 0;
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!selectedRes) return;
    if (!confirm('Are you sure you want to remove this skill?')) return;

    try {
      const updated = await removeSkill({
        resourceId: selectedRes._id,
        skillId,
      }).unwrap();
      
      setSelectedRes(updated);
      refetchResources();
    } catch {
      void 0;
    }
  };

  const handleDeactivate = async () => {
    if (!showDeactivateModal) return;
    try {
      await deactivateResource(showDeactivateModal._id).unwrap();
      setShowDeactivateModal(null);
      refetchResources();
    } catch {
      void 0;
    }
  };

  const handleAssignManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignSuccess(false);
    setAssignError('');

    if (!assignEmpUserId || !assignMgrUserId) {
      setAssignError('Please select both an employee and a manager.');
      return;
    }

    try {
      await assignManager({
        employeeUserId: assignEmpUserId,
        managerUserId: assignMgrUserId,
      }).unwrap();
      setAssignSuccess(true);
      setAssignEmpUserId('');
      setAssignMgrUserId('');
      refetchResources();
    } catch (err: unknown) {
      const errObj = err as { data?: { error?: string } };
      setAssignError(errObj?.data?.error || 'Failed to assign manager.');
    }
  };

  const getManagerLabel = (managerId?: string | null) => {
    if (!managerId) return 'Unassigned';
    const mgr = users.find(u => u._id === managerId);
    return mgr ? (mgr.fullName || mgr.username) : 'Unassigned';
  };

  return (
    <div>
      <div>
        <h1>Manage Resources</h1>
      </div>

      <div className="tabs">
        <button
          onClick={() => {
            setActiveTab('list');
            setShowSkillModal(false);
            setSelectedRes(null);
            setShowDeactivateModal(null);
          }}
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
        >
          View Resources
        </button>
        <button
          onClick={() => {
            setActiveTab('assign');
            setShowSkillModal(false);
            setSelectedRes(null);
            setShowDeactivateModal(null);
          }}
          className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`}
        >
          Assign Manager
        </button>
      </div>

      {activeTab === 'list' && (
        <div style={styles.flexColGap15}>
          <div className="card" style={styles.filterRow}>
            <div>
              <strong>Filters:</strong>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="BENCH">Bench</option>
              <option value="ALLOCATED">Allocated</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {isResLoading ? (
            <div style={styles.loadingOrEmpty}>Loading resources...</div>
          ) : resources.length === 0 ? (
            <div style={styles.loadingOrEmpty}>No resources match filters.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th style={styles.rightAlign}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((res) => (
                  <tr key={res._id}>
                    <td style={styles.resourceName}>{res.fullName}</td>
                    <td>{res.designation}</td>
                    <td>{getManagerLabel(res.managerId)}</td>
                    <td>
                      <span
                        className={
                          res.status === 'ALLOCATED'
                            ? 'status-allocated'
                            : res.status === 'BENCH'
                            ? 'status-bench'
                            : 'status-inactive'
                        }
                      >
                        {res.status}
                      </span>
                    </td>
                    <td style={styles.rightAlign}>
                      <button
                        onClick={() => {
                          setSelectedRes(res);
                          setShowSkillModal(true);
                          setShowDeactivateModal(null);
                        }}
                      >
                        Skills
                      </button>
                      {' '}
                      {res.isActive && (
                        res.userId === currentUser?.id ? (
                          <span style={styles.currentUserLabel}>
                            Current User
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setShowDeactivateModal(res);
                              setShowSkillModal(false);
                              setSelectedRes(null);
                            }}
                          >
                            Deactivate
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {showSkillModal && selectedRes && (
            <div className="card" style={styles.skillsPanel}>
              <div style={styles.panelHeader}>
                <div>
                  <h3 style={styles.panelTitle}>Manage Skills: {selectedRes.fullName}</h3>
                  <p style={styles.panelSubtitle}>Edit skill proficiency or add new skills</p>
                </div>
                <button
                  onClick={() => {
                    setShowSkillModal(false);
                    setSelectedRes(null);
                  }}
                >
                  Close Panel
                </button>
              </div>

              <div>
                <h4>Current Skills</h4>
                {selectedRes.skills.length === 0 ? (
                  <p style={styles.noSkillsMessage}>No skills listed on profile.</p>
                ) : (
                  <div style={styles.skillsList}>
                    {selectedRes.skills.map((s, idx) => {
                      const skillObj = s.skillId as Skill;
                      const sName = typeof s.skillId === 'object' ? skillObj.name : 'Unknown Skill';
                      const sId = typeof s.skillId === 'object' ? skillObj._id : s.skillId;
                      return (
                        <div
                          key={idx}
                          className="card"
                          style={styles.skillCard}
                        >
                          <div>
                            <div style={styles.skillName}>{sName}</div>
                            <div style={styles.skillProficiency}>
                              {s.proficiency}
                            </div>
                          </div>
                          <div style={styles.flexRowGap5}>
                            <select
                              value={s.proficiency}
                              onChange={(e) =>
                                handleUpdateSkill(sId, e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')
                              }
                              style={styles.profSelect}
                            >
                              <option value="BEGINNER">Beg</option>
                              <option value="INTERMEDIATE">Int</option>
                              <option value="ADVANCED">Adv</option>
                            </select>
                            <button
                              onClick={() => handleRemoveSkill(sId)}
                              style={styles.removeSkillButton}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={styles.formDivider}>
                <h4>Add Skill</h4>
                <form onSubmit={handleAddSkill} style={styles.addSkillForm}>
                  <div>
                    <label>Skill Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Node.js, Spring Boot"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Category</label>
                    <select
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value as 'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'QA' | 'OTHER')}
                    >
                      <option value="BACKEND">Backend</option>
                      <option value="FRONTEND">Frontend</option>
                      <option value="DEVOPS">DevOps</option>
                      <option value="QA">QA</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label>Proficiency</label>
                    <div style={styles.flexRowGap5}>
                      <select
                        value={newSkillProficiency}
                        onChange={(e) => setNewSkillProficiency(e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')}
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                      <button type="submit">Add Skill</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeactivateModal && (
            <div className="card" style={styles.deactivatePanel}>
              <h3 style={styles.deactivateTitle}>Deactivate Resource Profile?</h3>
              <p>
                Are you sure you want to deactivate <strong>{showDeactivateModal.fullName}</strong>?
              </p>

              <div style={styles.warningCallout}>
                <strong>Warning:</strong> Deactivating this resource will:
                <ul>
                  <li>End all active allocations immediately today.</li>
                  <li>Block their login account so they cannot sign in.</li>
                  <li>Preserve historical data (timesheets and allocation history).</li>
                </ul>
              </div>

              <div style={styles.flexRowGap10}>
                <button
                  type="button"
                  onClick={() => setShowDeactivateModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeactivate}
                  style={styles.deactivateConfirmButton}
                >
                  Confirm deactivation
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'assign' && (
        <div className="card" style={styles.assignCard}>
          <h2>Assign Delivery Manager</h2>
          <p style={styles.assignSubtitle}>
            Assign or update the manager associated with a resource. This controls team scoping for the Manager Resource Dashboard.
          </p>

          <form onSubmit={handleAssignManager}>
            {assignSuccess && (
              <div className="success-banner">
                Manager assigned successfully!
              </div>
            )}

            {assignError && (
              <div className="error-banner">
                {assignError}
              </div>
            )}

            <div>
              <label>Select Resource</label>
              <select
                value={assignEmpUserId}
                onChange={(e) => setAssignEmpUserId(e.target.value)}
                style={styles.assignSelect}
              >
                <option value="">-- Choose Resource --</option>
                {users
                  .filter((u) => u.role === 'EMPLOYEE' && u.isActive)
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.fullName || u.username} ({u.email})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label>Select Manager</label>
              <select
                value={assignMgrUserId}
                onChange={(e) => setAssignMgrUserId(e.target.value)}
                style={styles.assignSelect}
              >
                <option value="">-- Choose Manager --</option>
                {users
                  .filter((u) => u.role === 'MANAGER' && u.isActive)
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.fullName || u.username} ({u.email})
                    </option>
                  ))}
              </select>
            </div>

            <div style={styles.assignSubmitRow}>
              <button type="submit">Assign manager</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
