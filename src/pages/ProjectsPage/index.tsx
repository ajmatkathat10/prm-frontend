import { useState } from 'react';
import {
  Plus,
  Edit2,
  Calendar,
  PlusCircle,
  Activity,
} from 'lucide-react';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useAddMilestoneMutation,
  useUpdateMilestoneStatusMutation,
} from '@/store/services/projectApiSlice';
import { useGetUsersQuery } from '@/store/services/userApiSlice';
import type { Project, Milestone } from '@/types/project';
import { styles } from './projectsPage.styles';

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  const { data: projects = [], isLoading: isProjLoading, refetch: refetchProjects } = useGetProjectsQuery();
  const { data: users = [] } = useGetUsersQuery();

  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [addMilestone] = useAddMilestoneMutation();
  const [updateMilestoneStatus] = useUpdateMilestoneStatusMutation();

  const [selectedProj, setSelectedProj] = useState<Project | null>(null);
  const [editProj, setEditProj] = useState<Project | null>(null);

  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStart, setProjStart] = useState('');
  const [projEnd, setProjEnd] = useState('');
  const [projStatus, setProjStatus] = useState<'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED'>('PLANNED');
  const [projMgrId, setProjMgrId] = useState('');
  const [projSP, setProjSP] = useState(0);

  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editStatus, setEditStatus] = useState<'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED'>('PLANNED');
  const [editMgrId, setEditMgrId] = useState('');
  const [editSP, setEditSP] = useState(0);

  const [msTitle, setMsTitle] = useState('');
  const [msDue, setMsDue] = useState('');
  const [msSP, setMsSP] = useState(0);

  const [formError, setFormError] = useState('');

  const managers = users.filter((u) => u.role === 'MANAGER' && u.isActive);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!projName.trim() || !projStart || !projEnd || !projMgrId) {
      setFormError('All fields except description are required.');
      return;
    }

    try {
      await createProject({
        name: projName,
        description: projDesc,
        startDate: projStart,
        endDate: projEnd,
        status: projStatus,
        managerId: projMgrId,
        totalStoryPoints: Number(projSP),
      }).unwrap();

      setProjName('');
      setProjDesc('');
      setProjStart('');
      setProjEnd('');
      setProjMgrId('');
      setProjSP(0);
      refetchProjects();
      setActiveTab('list');
    } catch (err: unknown) {
      const errObj = err as { data?: { error?: string } };
      setFormError(errObj?.data?.error || 'Failed to create project.');
    }
  };

  const handleOpenEdit = (proj: Project) => {
    setEditProj(proj);
    setEditName(proj.name);
    setEditDesc(proj.description || '');
    setEditStart(proj.startDate.substring(0, 10));
    setEditEnd(proj.endDate.substring(0, 10));
    setEditStatus(proj.status);
    setEditMgrId(typeof proj.managerId === 'object' ? proj.managerId._id : proj.managerId);
    setEditSP(proj.totalStoryPoints);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProj) return;

    try {
      const updated = await updateProject({
        projectId: editProj._id,
        data: {
          name: editName,
          description: editDesc,
          startDate: editStart,
          endDate: editEnd,
          status: editStatus,
          managerId: editMgrId,
          totalStoryPoints: Number(editSP),
        },
      }).unwrap();

      if (selectedProj?._id === editProj._id) {
        setSelectedProj(updated);
      }
      setEditProj(null);
      refetchProjects();
    } catch {
      void 0;
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProj || !msTitle.trim() || !msDue) return;

    try {
      const updated = await addMilestone({
        projectId: selectedProj._id,
        title: msTitle.trim(),
        dueDate: msDue,
        storyPoints: Number(msSP),
      }).unwrap();

      setSelectedProj(updated);
      setMsTitle('');
      setMsDue('');
      setMsSP(0);
      refetchProjects();
    } catch {
      void 0;
    }
  };

  const handleUpdateMilestoneStatus = async (milestoneId: string, status: string) => {
    if (!selectedProj) return;
    try {
      const updated = await updateMilestoneStatus({
        projectId: selectedProj._id,
        milestoneId,
        status,
      }).unwrap();
      setSelectedProj(updated);
      refetchProjects();
    } catch {
      void 0;
    }
  };

  const calculateMilestoneStats = (proj: Project) => {
    const total = proj.totalStoryPoints;
    const completed = proj.milestones
      .filter((m) => m.status === 'DONE')
      .reduce((sum, m) => sum + m.storyPoints, 0);
    const remaining = total - completed;
    return { total, completed, remaining };
  };

  const getCompletedMilestonesSP = (proj: Project) => {
    return proj.milestones
      .filter((m) => m.status === 'DONE')
      .reduce((sum, m) => sum + m.storyPoints, 0);
  };

  const getManagerUsername = (proj: Project) => {
    if (typeof proj.managerId === 'object') {
      return proj.managerId.username;
    }
    const mgr = users.find((u) => u._id === proj.managerId);
    return mgr ? mgr.username : 'Unknown';
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Manage Projects</h1>
      </div>

      <div className="tabs">
        <button
          onClick={() => setActiveTab('list')}
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
        >
          View & Manage Projects
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
        >
          Create Project
        </button>
      </div>

      {activeTab === 'list' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              {isProjLoading ? (
                <div className="p-8 text-center text-slate-400">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No projects registered.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase bg-slate-950">
                        <th className="px-6 py-4">Project Name</th>
                        <th className="px-6 py-4">Manager</th>
                        <th className="px-6 py-4">End Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">SP Done/Total</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200 text-sm">
                      {projects.map((proj) => (
                        <tr
                          key={proj._id}
                          onClick={() => setSelectedProj(proj)}
                          className={`hover:bg-slate-850/40 transition-colors cursor-pointer ${
                            selectedProj?._id === proj._id ? 'bg-slate-800/40' : ''
                          }`}
                        >
                          <td className="px-6 py-4 font-semibold text-slate-50">{proj.name}</td>
                          <td className="px-6 py-4 text-slate-400">{getManagerUsername(proj)}</td>
                          <td className="px-6 py-4 text-slate-400">
                            {new Date(proj.endDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                proj.status === 'ACTIVE'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : proj.status === 'PLANNED'
                                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                  : proj.status === 'ON_HOLD'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                              }`}
                            >
                              {proj.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {getCompletedMilestonesSP(proj)} / {proj.totalStoryPoints} SP
                          </td>
                          <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleOpenEdit(proj)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-50 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {selectedProj ? (
              <div style={styles.detailsContainer}>
                <div>
                  <h3 style={styles.detailsHeader}>{selectedProj.name}</h3>
                  <p style={styles.detailsDescription}>{selectedProj.description}</p>
                </div>

                {(() => {
                  const { total, completed, remaining } = calculateMilestoneStats(selectedProj);
                  return (
                    <div style={styles.statsRow}>
                      <div>
                        <div style={styles.statsLabel}>Total SP</div>
                        <div style={styles.statsValueTotal}>{total}</div>
                      </div>
                      <div style={styles.borderLeftSeparator}>
                        <div style={styles.statsLabel}>Completed</div>
                        <div style={styles.statsValueCompleted}>{completed}</div>
                      </div>
                      <div style={styles.borderLeftSeparator}>
                        <div style={styles.statsLabel}>Remaining</div>
                        <div style={styles.statsValueRemaining}>{remaining}</div>
                      </div>
                    </div>
                  );
                })()}

                <div style={styles.section}>
                  <h4 style={styles.sectionTitleRow}>
                    <Activity className="w-4 h-4 text-amber-500" />
                    Project Milestones
                  </h4>

                  {selectedProj.milestones.length === 0 ? (
                    <p style={styles.emptyListMessage}>No milestones defined yet.</p>
                  ) : (
                    <div style={styles.milestonesList}>
                      {selectedProj.milestones.map((ms: Milestone) => (
                        <div
                          key={ms._id}
                          style={styles.milestoneItem}
                        >
                          <div>
                            <div style={styles.milestoneTitle}>{ms.title}</div>
                            <div style={styles.milestoneMetaRow}>
                              <span style={styles.dueIconWrapper}>
                                <Calendar className="w-3.5 h-3.5" style={styles.dueIcon} />
                                Due: {new Date(ms.dueDate).toLocaleDateString()}
                              </span>
                              <span style={styles.milestonePoints}>
                                {ms.storyPoints} Story Points
                              </span>
                            </div>
                          </div>
                          <div>
                            <select
                              value={ms.status}
                              onChange={(e) =>
                                handleUpdateMilestoneStatus(ms._id || '', e.target.value)
                              }
                              style={styles.statusSelect}
                            >
                              <option value="NOT_STARTED">Not Started</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="DONE">Done</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={styles.formDivider}>
                  <h4 style={styles.sectionTitleRow}>
                    <PlusCircle className="w-4 h-4 text-indigo-500" /> Add Milestone
                  </h4>
                  <form onSubmit={handleAddMilestone} style={styles.formContainer}>
                    <input
                      type="text"
                      placeholder="Milestone Title"
                      value={msTitle}
                      onChange={(e) => setMsTitle(e.target.value)}
                      style={styles.fullWidthInput}
                      required
                    />
                    <div style={styles.flexRowGap12}>
                      <div style={styles.flexOne}>
                        <label style={styles.fieldLabelSmall}>Due Date</label>
                        <input
                          type="date"
                          value={msDue}
                          onChange={(e) => setMsDue(e.target.value)}
                          style={styles.smallInput}
                          required
                        />
                      </div>
                      <div style={styles.flexOne}>
                        <label style={styles.fieldLabelSmall}>Story Points</label>
                        <input
                          type="number"
                          value={msSP}
                          onChange={(e) => setMsSP(Number(e.target.value))}
                          style={styles.smallInput}
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      style={styles.addMilestoneButton}
                    >
                      Add Milestone
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 italic">
                Select a project from the table to manage its milestones and view delivery metrics.
              </div>
            )}
          </div>
        </div>

        {editProj && (
          <div className="card" style={styles.editPanel}>
            <div style={styles.panelHeaderRow}>
              <div>
                <h3 style={styles.panelTitle}>Update Project: {editProj.name}</h3>
                <p style={styles.panelSubtitle}>Modify key deliverables and assignments</p>
              </div>
              <button onClick={() => setEditProj(null)} type="button">Close Panel</button>
            </div>
            <form onSubmit={handleUpdateProject} style={styles.editFormContainer}>
              <div>
                <label>Project Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={styles.widthFull} />
              </div>
              <div>
                <label>Description</label>
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={2} style={styles.widthFullNoResize} />
              </div>
              <div style={styles.flexWrapRow}>
                <div style={styles.flexOneMinWidth140}>
                  <label>Start Date</label>
                  <input type="date" value={editStart} onChange={(e) => setEditStart(e.target.value)} style={styles.widthFull} />
                </div>
                <div style={styles.flexOneMinWidth140}>
                  <label>End Date</label>
                  <input type="date" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} style={styles.widthFull} />
                </div>
              </div>
              <div style={styles.flexWrapRow}>
                <div style={styles.flexOneMinWidth120}>
                  <label>Status</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED')} style={styles.widthFull}>
                    <option value="PLANNED">Planned</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div style={styles.flexOneMinWidth150}>
                  <label>Manager</label>
                  <select value={editMgrId} onChange={(e) => setEditMgrId(e.target.value)} style={styles.widthFull}>
                    <option value="">-- Choose Manager --</option>
                    {managers.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.flexOneMinWidth100}>
                  <label>Total SP</label>
                  <input type="number" value={editSP} onChange={(e) => setEditSP(Number(e.target.value))} style={styles.widthFull} />
                </div>
              </div>
              <div style={styles.actionsRow}>
                <button type="button" onClick={() => setEditProj(null)}>Cancel</button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        )}
      </>
    )}

      {activeTab === 'create' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" />
            Create Project Profile
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Enter project details, allocate maximum effort parameters, and assign ownership.
          </p>

          <form onSubmit={handleCreateProject} className="space-y-4">
            {formError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-300">Project Name</label>
              <input
                type="text"
                placeholder="e.g. NextGen Web Portal"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-300">Description</label>
              <textarea
                placeholder="Details about project objectives, clients..."
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">Start Date</label>
                <input
                  type="date"
                  value={projStart}
                  onChange={(e) => setProjStart(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">End Date</label>
                <input
                  type="date"
                  value={projEnd}
                  onChange={(e) => setProjEnd(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">Status</label>
                <select
                  value={projStatus}
                  onChange={(e) => setProjStatus(e.target.value as 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED')}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-amber-500"
                >
                  <option value="PLANNED">Planned</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">Assign Manager</label>
                <select
                  value={projMgrId}
                  onChange={(e) => setProjMgrId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Manager --</option>
                  {managers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">Total Story Points</label>
                <input
                  type="number"
                  value={projSP}
                  onChange={(e) => setProjSP(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-slate-50 font-bold py-2.5 px-4 rounded-lg transition-colors mt-4"
            >
              Create Project
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
