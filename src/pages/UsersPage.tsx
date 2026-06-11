import { useState } from 'react';
import {
  Plus,
  Key,
  ShieldAlert,
  Check,
  UserX,
  RefreshCw,
  X,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useReactivateUserMutation,
  useDeactivateUserMutation,
  useResetPasswordMutation,
} from '@/store/services/userApiSlice';
import { useAuth } from '@/hooks/useAuth';
import type { AdminUser } from '@/types/user';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const { user: currentUser } = useAuth();

  // Queries & Mutations
  const { data: users = [], isLoading, refetch } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [reactivateUser] = useReactivateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [resetPassword] = useResetPasswordMutation();

  // Modal State
  const [selectedUserForReset, setSelectedUserForReset] = useState<AdminUser | null>(null);
  const [selectedUserForDeactivate, setSelectedUserForDeactivate] = useState<AdminUser | null>(null);
  const [selectedUserForReactivate, setSelectedUserForReactivate] = useState<AdminUser | null>(null);

  // Forms State - Create User
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER' | 'EMPLOYEE'>('EMPLOYEE');
  const [designation, setDesignation] = useState('Software Engineer');

  // Forms State - Reset Password
  const [newTempPassword, setNewTempPassword] = useState('');

  // Password visibility & copying states
  const [showTempPass, setShowTempPass] = useState(false);
  const [copiedTempPass, setCopiedTempPass] = useState(false);
  const [showNewTempPass, setShowNewTempPass] = useState(false);
  const [copiedNewTempPass, setCopiedNewTempPass] = useState(false);

  const handleCopyTempPass = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    setCopiedTempPass(true);
    setTimeout(() => setCopiedTempPass(false), 2000);
  };

  const handleCopyNewTempPass = () => {
    if (!newTempPassword) return;
    navigator.clipboard.writeText(newTempPassword);
    setCopiedNewTempPass(true);
    setTimeout(() => setCopiedNewTempPass(false), 2000);
  };

  const handleCloseResetModal = () => {
    setSelectedUserForReset(null);
    setNewTempPassword('');
    setShowNewTempPass(false);
    setCopiedNewTempPass(false);
  };

  // Alerts
  const [formError, setFormError] = useState('');

  // Handlers
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !email.trim() || !username.trim() || !tempPassword.trim()) {
      setFormError('All fields are mandatory.');
      return;
    }

    try {
      await createUser({
        fullName,
        email,
        username,
        password: tempPassword,
        role,
        designation: role === 'EMPLOYEE' ? designation : undefined,
      }).unwrap();

      setFullName('');
      setEmail('');
      setUsername('');
      setTempPassword('');
      setRole('EMPLOYEE');
      setDesignation('Software Engineer');
      setShowTempPass(false);
      setCopiedTempPass(false);
      refetch();
      setActiveTab('list');
    } catch (err: unknown) {
      const errObj = err as { data?: { error?: string } };
      setFormError(errObj?.data?.error || 'Failed to create user account.');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset || !newTempPassword.trim()) return;

    try {
      await resetPassword({
        userId: selectedUserForReset._id,
        newPassword: newTempPassword,
      }).unwrap();

      setSelectedUserForReset(null);
      setNewTempPassword('');
      setShowNewTempPass(false);
      setCopiedNewTempPass(false);
      refetch();
    } catch {
      // Handled by toast middleware
    }
  };

  const handleDeactivate = async () => {
    if (!selectedUserForDeactivate) return;
    try {
      await deactivateUser(selectedUserForDeactivate._id).unwrap();
      setSelectedUserForDeactivate(null);
      refetch();
    } catch {
      // Handled by toast middleware
    }
  };

  const handleReactivate = async () => {
    if (!selectedUserForReactivate) return;
    try {
      await reactivateUser(selectedUserForReactivate._id).unwrap();
      setSelectedUserForReactivate(null);
      refetch();
    } catch {
      // Handled by toast middleware
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Manage Users</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-5 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'list'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          View All Users
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-5 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'create'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Provision User Account
        </button>
      </div>

      {/* View list tab */}
      {activeTab === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading user accounts...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase bg-slate-950">
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200 text-sm">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-50">{u.username}</td>
                      <td className="px-6 py-4 text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            u.role === 'ADMIN'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : u.role === 'MANAGER'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                            u.isActive
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-rose-500/15 text-rose-455'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedUserForReset(u)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-750 hover:text-slate-50 text-xs text-slate-300 font-medium transition-colors"
                        >
                          <Key className="w-3.5 h-3.5" />
                          Reset Pass
                        </button>
                        {u.isActive ? (
                          u._id === currentUser?.id ? (
                            <span className="inline-block text-xs font-semibold text-slate-500 px-3 py-1.5 select-none">
                              Current User
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedUserForDeactivate(u)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-955/20 border border-rose-900/30 hover:bg-rose-900/40 hover:text-rose-250 text-xs text-rose-400 font-medium transition-colors"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              Deactivate
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => setSelectedUserForReactivate(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-955/20 border border-emerald-900/30 hover:bg-emerald-900/40 hover:text-emerald-250 text-xs text-emerald-400 font-medium transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Provision Form tab */}
      {activeTab === 'create' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl">
          <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
            <Plus className="w-5 h-5 text-rose-400" />
            Provision New User Account
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Input details to initialize a credential profile. Corresponding employee profiles are auto-linked for Employees only. Managers and Admins are credential-only profiles.
          </p>

          <form onSubmit={handleCreateUser} className="space-y-4">
            {formError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Ravi Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                placeholder="e.g. ravi@techserve.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">Username</label>
                <input
                  type="text"
                  placeholder="e.g. ravi.kumar"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-rose-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">Temporary Password</label>
                <div className="relative">
                  <input
                    type={showTempPass ? 'text' : 'password'}
                    placeholder="e.g. TempPass@1"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg pl-4 pr-20 py-2 outline-none focus:border-rose-500"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowTempPass(!showTempPass)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showTempPass ? 'Hide password' : 'Show password'}
                    >
                      {showTempPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyTempPass}
                      disabled={!tempPassword}
                      className={`p-1.5 transition-colors ${
                        !tempPassword
                          ? 'text-slate-650 cursor-not-allowed'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Copy to clipboard"
                    >
                      {copiedTempPass ? (
                        <Check className="w-4 h-4 text-emerald-450" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-300">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'ADMIN' | 'MANAGER' | 'EMPLOYEE')}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 outline-none focus:border-rose-500"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            {role === 'EMPLOYEE' && (
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">Resource Designation</label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2.5 outline-none focus:border-rose-500"
                >
                  <option value="Junior Software Engineer">Junior Software Engineer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="Devops Engineer">Devops Engineer</option>
                  <option value="Senior Devops engineer">Senior Devops engineer</option>
                  <option value="UI Tester">UI Tester</option>
                  <option value="Senior UI Tester">Senior UI Tester</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-500 text-slate-50 font-bold py-2.5 px-4 rounded-lg transition-colors mt-4"
            >
              Provision Account
            </button>
          </form>
        </div>
      )}

      {/* Reset Password Modal */}
      {selectedUserForReset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-50">Reset Password: {selectedUserForReset.username}</h3>
                <p className="text-xs text-slate-400">Issue a new password token</p>
              </div>
              <button
                onClick={handleCloseResetModal}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-300">New Temporary Password</label>
                <div className="relative">
                  <input
                    type={showNewTempPass ? 'text' : 'password'}
                    placeholder="At least 8 chars, 1 uppercase, 1 number"
                    value={newTempPassword}
                    onChange={(e) => setNewTempPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg pl-4 pr-20 py-2 outline-none focus:border-rose-500"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowNewTempPass(!showNewTempPass)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showNewTempPass ? 'Hide password' : 'Show password'}
                    >
                      {showNewTempPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyNewTempPass}
                      disabled={!newTempPassword}
                      className={`p-1.5 transition-colors ${
                        !newTempPassword
                          ? 'text-slate-650 cursor-not-allowed'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Copy to clipboard"
                    >
                      {copiedNewTempPass ? (
                        <Check className="w-4 h-4 text-emerald-450" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseResetModal}
                  className="px-4 py-2 text-sm text-slate-400 bg-slate-850 hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-slate-50 rounded-lg transition-colors"
                >
                  Reset password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate User confirmation modal */}
      {selectedUserForDeactivate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-rose-455" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-50">Deactivate Login Credentials?</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Block login capabilities for user <strong>{selectedUserForDeactivate.username}</strong>?
                </p>
              </div>
            </div>

            <div className="bg-rose-955/10 border border-rose-900/30 p-4 rounded-xl text-rose-300 text-xs leading-relaxed space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Warning
              </p>
              <p>
                This action will instantly:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Block user authentication services (cannot log in).</li>
                <li>Deactivate their matching employee profile.</li>
                <li>Terminate all overlapping allocations today.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedUserForDeactivate(null)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className="px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-slate-50 rounded-lg transition-colors"
              >
                Deactivate login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate User confirmation modal */}
      {selectedUserForReactivate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-50">Reactivate Account?</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Re-authorize access for user <strong>{selectedUserForReactivate.username}</strong>?
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs bg-slate-950 border border-slate-800 p-3 rounded-lg leading-relaxed">
              <strong>Note:</strong> Previous allocations are NOT restored automatically. The resource profile status resets to BENCH. You will need to manually configure allocations if desired.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedUserForReactivate(null)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReactivate}
                className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-50 rounded-lg transition-colors"
              >
                Confirm reactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
