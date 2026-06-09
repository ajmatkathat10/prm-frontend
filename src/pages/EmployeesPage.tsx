import { useState } from 'react';
import {
  UserCheck,
  Plus,
  Trash2,
  Edit,
  X,
  ShieldAlert,
  Filter,
  Check,
} from 'lucide-react';
import {
  useGetEmployeesQuery,
  useDeactivateEmployeeMutation,
  useAddEmployeeSkillMutation,
  useUpdateEmployeeSkillMutation,
  useRemoveEmployeeSkillMutation,
  useAssignManagerMutation,
} from '@/store/services/employeeApiSlice';
import { useGetUsersQuery } from '@/store/services/userApiSlice';
import { useAuth } from '@/hooks/useAuth';
import type { Employee, Skill } from '@/types/employee';

export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'assign'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('');
  const { user: currentUser } = useAuth();

  // Queries & Mutations
  const { data: employees = [], isLoading: isEmpLoading, refetch: refetchEmployees } = useGetEmployeesQuery({
    status: statusFilter || undefined,
    department: deptFilter || undefined,
  });

  const { data: users = [] } = useGetUsersQuery();

  const [deactivateEmployee] = useDeactivateEmployeeMutation();
  const [addSkill] = useAddEmployeeSkillMutation();
  const [updateSkill] = useUpdateEmployeeSkillMutation();
  const [removeSkill] = useRemoveEmployeeSkillMutation();
  const [assignManager] = useAssignManagerMutation();

  // Dialog State
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState<Employee | null>(null);

  // Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'QA' | 'OTHER'>('BACKEND');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');

  const [assignEmpUserId, setAssignEmpUserId] = useState('');
  const [assignMgrUserId, setAssignMgrUserId] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [assignError, setAssignError] = useState('');

  // Handlers
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !newSkillName.trim()) return;

    try {
      const updated = await addSkill({
        employeeId: selectedEmp._id,
        name: newSkillName.trim(),
        category: newSkillCategory,
        proficiency: newSkillProficiency,
      }).unwrap();
      
      setSelectedEmp(updated);
      setNewSkillName('');
      refetchEmployees();
    } catch {
      // Handled by toast middleware
    }
  };

  const handleUpdateSkill = async (skillId: string, prof: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => {
    if (!selectedEmp) return;
    try {
      const updated = await updateSkill({
        employeeId: selectedEmp._id,
        skillId,
        proficiency: prof,
      }).unwrap();
      
      setSelectedEmp(updated);
      refetchEmployees();
    } catch {
      // Handled by toast middleware
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!selectedEmp) return;
    if (!confirm('Are you sure you want to remove this skill?')) return;

    try {
      const updated = await removeSkill({
        employeeId: selectedEmp._id,
        skillId,
      }).unwrap();
      
      setSelectedEmp(updated);
      refetchEmployees();
    } catch {
      // Handled by toast middleware
    }
  };

  const handleDeactivate = async () => {
    if (!showDeactivateModal) return;
    try {
      await deactivateEmployee(showDeactivateModal._id).unwrap();
      setShowDeactivateModal(null);
      refetchEmployees();
    } catch {
      // Handled by toast middleware
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
      refetchEmployees();
    } catch (err: unknown) {
      const errObj = err as { data?: { error?: string } };
      setAssignError(errObj?.data?.error || 'Failed to assign manager.');
    }
  };

  // Helper to get manager username/name
  const getManagerLabel = (managerId?: string | null) => {
    if (!managerId) return 'Unassigned';
    const mgr = users.find(u => u._id === managerId);
    return mgr ? mgr.username : 'Unassigned';
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Manage Employees</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-5 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'list'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          View Employees
        </button>
        <button
          onClick={() => setActiveTab('assign')}
          className={`px-5 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'assign'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Assign Manager
        </button>
      </div>

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Filter className="w-4 h-4" />
              <span>Filters:</span>
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="BENCH">Bench</option>
              <option value="ALLOCATED">Allocated</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            {/* Department */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Delivery">Delivery</option>
              <option value="QA">QA</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {isEmpLoading ? (
              <div className="p-8 text-center text-slate-400">Loading employees...</div>
            ) : employees.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No employees match filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase bg-slate-950">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Designation</th>
                      <th className="px-6 py-4">Manager</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200 text-sm">
                    {employees.map((emp) => (
                      <tr key={emp._id} className="hover:bg-slate-850/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-50">{emp.fullName}</td>
                        <td className="px-6 py-4">{emp.department}</td>
                        <td className="px-6 py-4 text-slate-400">{emp.designation}</td>
                        <td className="px-6 py-4 text-slate-400">
                          {getManagerLabel(emp.managerId)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              emp.status === 'ALLOCATED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : emp.status === 'BENCH'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedEmp(emp);
                              setShowSkillModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-slate-50 text-xs text-slate-300 font-medium transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Skills
                          </button>
                          {emp.isActive && (
                            emp.userId === currentUser?.id ? (
                              <span className="inline-block text-xs font-semibold text-slate-500 px-3 py-1.5 select-none">
                                Current User
                              </span>
                            ) : (
                              <button
                                onClick={() => setShowDeactivateModal(emp)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-955/20 border border-rose-900/30 hover:bg-rose-900/40 hover:text-rose-205 text-xs text-rose-400 font-medium transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Deactivate
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assign Manager Tab */}
      {activeTab === 'assign' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl">
          <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Assign Delivery Manager
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Assign or update the manager associated with an employee. This controls team scoping for the Manager Resource Dashboard.
          </p>

          <form onSubmit={handleAssignManager} className="space-y-5">
            {assignSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                Manager assigned successfully!
              </div>
            )}

            {assignError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {assignError}
              </div>
            )}

            {/* Employee Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Select Employee</label>
              <select
                value={assignEmpUserId}
                onChange={(e) => setAssignEmpUserId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose Employee --</option>
                {users
                  .filter((u) => u.role === 'EMPLOYEE' && u.isActive)
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.username} ({u.email})
                    </option>
                  ))}
              </select>
            </div>

            {/* Manager Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Select Manager</label>
              <select
                value={assignMgrUserId}
                onChange={(e) => setAssignMgrUserId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose Manager --</option>
                {users
                  .filter((u) => u.role === 'MANAGER' && u.isActive)
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.username} ({u.email})
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-bold py-2.5 px-4 rounded-lg transition-colors"
            >
              Assign manager
            </button>
          </form>
        </div>
      )}

      {/* Skills Dialog Modal */}
      {showSkillModal && selectedEmp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-50">{selectedEmp.fullName}</h3>
                <p className="text-xs text-slate-400">Manage profile skill inventory</p>
              </div>
              <button
                onClick={() => {
                  setShowSkillModal(false);
                  setSelectedEmp(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Current Skills list */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Current Skills</h4>
                {selectedEmp.skills.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No skills listed on profile.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEmp.skills.map((s, idx) => {
                      const skillObj = s.skillId as Skill;
                      const sName = typeof s.skillId === 'object' ? skillObj.name : 'Unknown Skill';
                      const sId = typeof s.skillId === 'object' ? skillObj._id : s.skillId;
                      return (
                        <div
                          key={idx}
                          className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-semibold text-sm text-slate-200">{sName}</div>
                            <div className="text-xs text-indigo-400 uppercase tracking-wider mt-0.5">
                              {s.proficiency}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {/* Toggle proficiency */}
                            <select
                              value={s.proficiency}
                              onChange={(e) =>
                                handleUpdateSkill(sId, e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')
                              }
                              className="bg-slate-900 border border-slate-750 text-slate-300 text-xs rounded px-1.5 py-1 outline-none"
                            >
                              <option value="BEGINNER">Beg</option>
                              <option value="INTERMEDIATE">Int</option>
                              <option value="ADVANCED">Adv</option>
                            </select>
                            {/* Remove */}
                            <button
                              onClick={() => handleRemoveSkill(sId)}
                              className="p-1 text-rose-500 hover:bg-rose-955/20 rounded hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add skill form */}
              <div className="border-t border-slate-800 pt-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-4">Add Skill</h4>
                <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Skill Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Node.js, Spring Boot"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Category</label>
                    <select
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value as 'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'QA' | 'OTHER')}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                    >
                      <option value="BACKEND">Backend</option>
                      <option value="FRONTEND">Frontend</option>
                      <option value="DEVOPS">DevOps</option>
                      <option value="QA">QA</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1 flex flex-col justify-between">
                    <label className="text-xs text-slate-400 font-medium">Proficiency</label>
                    <div className="flex gap-2">
                      <select
                        value={newSkillProficiency}
                        onChange={(e) => setNewSkillProficiency(e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')}
                        className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-bold p-2.5 rounded-lg shrink-0 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate confirmation Warning Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-50">Deactivate Employee Profile?</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Are you sure you want to deactivate <strong>{showDeactivateModal.fullName}</strong>?
                </p>
              </div>
            </div>

            <div className="bg-rose-955/10 border border-rose-900/30 p-4 rounded-xl text-rose-300 text-xs leading-relaxed space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-455" /> Warning
              </p>
              <p>
                Deactivating this employee record will immediately:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>End all active overlapping allocations today.</li>
                <li>Block their login account so they cannot sign in.</li>
                <li>Preserve historical data (timesheets and allocation history).</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeactivateModal(null)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className="px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-slate-50 rounded-lg transition-colors"
              >
                Confirm deactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
