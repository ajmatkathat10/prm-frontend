import { useState } from 'react';
import {
  Plus,
  Edit2,
  Calendar,
  X,
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

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  // Queries & Mutations
  const { data: projects = [], isLoading: isProjLoading, refetch: refetchProjects } = useGetProjectsQuery();
  const { data: users = [] } = useGetUsersQuery();

  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [addMilestone] = useAddMilestoneMutation();
  const [updateMilestoneStatus] = useUpdateMilestoneStatusMutation();

  // Selection & Modal State
  const [selectedProj, setSelectedProj] = useState<Project | null>(null);
  const [editProj, setEditProj] = useState<Project | null>(null);

  // Forms State - Create Project
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStart, setProjStart] = useState('');
  const [projEnd, setProjEnd] = useState('');
  const [projStatus, setProjStatus] = useState<'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED'>('PLANNED');
  const [projMgrId, setProjMgrId] = useState('');
  const [projSP, setProjSP] = useState(0);

  // Forms State - Update Project
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editStatus, setEditStatus] = useState<'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED'>('PLANNED');
  const [editMgrId, setEditMgrId] = useState('');
  const [editSP, setEditSP] = useState(0);

  // Forms State - Add Milestone
  const [msTitle, setMsTitle] = useState('');
  const [msDue, setMsDue] = useState('');
  const [msSP, setMsSP] = useState(0);

  // Alerts
  const [formError, setFormError] = useState('');

  // Filter manager accounts
  const managers = users.filter((u) => u.role === 'MANAGER' && u.isActive);

  // Handlers
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

      // If we are currently viewing this project's milestones, update the displayed object
      if (selectedProj?._id === editProj._id) {
        setSelectedProj(updated);
      }
      setEditProj(null);
      refetchProjects();
    } catch {
      // Handled by toast middleware
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
      // Handled by toast middleware
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
      // Handled by toast middleware
    }
  };

  // Calculations
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Manage Projects</h1>
      </div>

      {/* Tabs */}
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

      {/* View/List Tab */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List Panel */}
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

          {/* Milestones Panel on selection */}
          <div className="space-y-6">
            {selectedProj ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-50">{selectedProj.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{selectedProj.description}</p>
                </div>

                {/* SP stats card */}
                {(() => {
                  const { total, completed, remaining } = calculateMilestoneStats(selectedProj);
                  return (
                    <div className="grid grid-cols-3 gap-3 bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
                      <div>
                        <div className="text-slate-400 text-xxs font-semibold uppercase">Total SP</div>
                        <div className="text-lg font-bold text-slate-100 mt-0.5">{total}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xxs font-semibold uppercase">Completed</div>
                        <div className="text-lg font-bold text-emerald-400 mt-0.5">{completed}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xxs font-semibold uppercase">Remaining</div>
                        <div className="text-lg font-bold text-indigo-400 mt-0.5">{remaining}</div>
                      </div>
                    </div>
                  );
                })()}

                {/* Milestones List */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    Project Milestones
                  </h4>

                  {selectedProj.milestones.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No milestones defined yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
                      {selectedProj.milestones.map((ms: Milestone) => (
                        <div
                          key={ms._id}
                          className="bg-slate-850/60 border border-slate-800/80 rounded-xl p-3 flex justify-between items-center"
                        >
                          <div className="space-y-1">
                            <div className="font-semibold text-sm text-slate-200">{ms.title}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              Due: {new Date(ms.dueDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-amber-400">{ms.storyPoints} Story Points</div>
                          </div>
                          <div>
                            <select
                              value={ms.status}
                              onChange={(e) =>
                                handleUpdateMilestoneStatus(ms._id || '', e.target.value)
                              }
                              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 outline-none"
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

                {/* Add Milestone Subform */}
                <div className="border-t border-slate-850 pt-5">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-1">
                    <PlusCircle className="w-4 h-4 text-indigo-400" /> Add Milestone
                  </h4>
                  <form onSubmit={handleAddMilestone} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Milestone Title"
                      value={msTitle}
                      onChange={(e) => setMsTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-amber-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xxs text-slate-400 font-semibold block mb-1">Due Date</label>
                        <input
                          type="date"
                          value={msDue}
                          onChange={(e) => setMsDue(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xxs text-slate-400 font-semibold block mb-1">Story Points</label>
                        <input
                          type="number"
                          value={msSP}
                          onChange={(e) => setMsSP(Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-500 text-slate-50 font-bold py-2 rounded-lg transition-colors text-sm"
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
      )}

      {/* Create Tab */}
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

      {editProj && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-50">Update Project: {editProj.name}</h3>
                <p className="text-xs text-slate-400">Modify key deliverables and assignments</p>
              </div>
              <button
                onClick={() => setEditProj(null)}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleUpdateProject} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">Project Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={editStart}
                    onChange={(e) => setEditStart(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-300">End Date</label>
                  <input
                    type="date"
                    value={editEnd}
                    onChange={(e) => setEditEnd(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-300">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED')}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none"
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-300">Manager</label>
                  <select
                    value={editMgrId}
                    onChange={(e) => setEditMgrId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none"
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
                  <label className="block text-sm font-semibold text-slate-300">Total SP</label>
                  <input
                    type="number"
                    value={editSP}
                    onChange={(e) => setEditSP(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditProj(null)}
                  className="px-4 py-2 text-sm text-slate-400 bg-slate-850 hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-amber-600 hover:bg-amber-500 text-slate-50 rounded-lg transition-colors"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
