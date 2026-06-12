import { useState } from 'react';
import {
  Plus,
  Key,
  Check,
  UserX,
  RefreshCw,
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
import { styles } from './usersPage.styles';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const { user: currentUser } = useAuth();

  const { data: users = [], isLoading, refetch } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [reactivateUser] = useReactivateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [resetPassword] = useResetPasswordMutation();

  const [selectedUserForReset, setSelectedUserForReset] = useState<AdminUser | null>(null);
  const [selectedUserForDeactivate, setSelectedUserForDeactivate] = useState<AdminUser | null>(null);
  const [selectedUserForReactivate, setSelectedUserForReactivate] = useState<AdminUser | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER' | 'EMPLOYEE'>('EMPLOYEE');
  const [designation, setDesignation] = useState('Software Engineer');

  const [newTempPassword, setNewTempPassword] = useState('');

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

  const [formError, setFormError] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !email.trim() || !username.trim() || !tempPassword.trim()) {
      setFormError('All fields are mandatory.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Invalid email format.');
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
      void 0;
    }
  };

  const handleDeactivate = async () => {
    if (!selectedUserForDeactivate) return;
    try {
      await deactivateUser(selectedUserForDeactivate._id).unwrap();
      setSelectedUserForDeactivate(null);
      refetch();
    } catch {
      void 0;
    }
  };

  const handleReactivate = async () => {
    if (!selectedUserForReactivate) return;
    try {
      await reactivateUser(selectedUserForReactivate._id).unwrap();
      setSelectedUserForReactivate(null);
      refetch();
    } catch {
      void 0;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Manage Users</h1>
      </div>

      <div className="tabs">
        <button
          onClick={() => setActiveTab('list')}
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
        >
          View All Users
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
        >
          Provision User Account
        </button>
      </div>

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
                          className={u.isActive ? 'status-allocated' : 'status-inactive'}
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

          {selectedUserForReset && (
            <div className="card" style={styles.resetPanel}>
              <div style={styles.panelHeader}>
                <div>
                  <h3 style={styles.panelTitle}>Reset Password: {selectedUserForReset.username}</h3>
                  <p style={styles.panelSubtitle}>Issue a new password token</p>
                </div>
                <button onClick={handleCloseResetModal} type="button">Close Panel</button>
              </div>

              <form onSubmit={handleResetPasswordSubmit} style={styles.formContainer}>
                <div>
                  <label>New Temporary Password</label>
                  <div style={styles.inputWithButtonRow}>
                    <input
                      type={showNewTempPass ? 'text' : 'password'}
                      placeholder="At least 8 chars, 1 uppercase, 1 number"
                      value={newTempPassword}
                      onChange={(e) => setNewTempPassword(e.target.value)}
                      style={styles.flexOneInput}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewTempPass(!showNewTempPass)}
                    >
                      {showNewTempPass ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyNewTempPass}
                      disabled={!newTempPassword}
                    >
                      {copiedNewTempPass ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div style={styles.actionsRow}>
                  <button type="button" onClick={handleCloseResetModal}>Cancel</button>
                  <button type="submit">Reset password</button>
                </div>
              </form>
            </div>
          )}

          {selectedUserForDeactivate && (
            <div className="card" style={styles.deactivatePanel}>
              <h3 style={styles.deactivateTitle}>Deactivate Login Credentials?</h3>
              <p>
                Block login capabilities for user <strong>{selectedUserForDeactivate.username}</strong>?
              </p>

              <div style={styles.warningCallout}>
                <strong>Warning:</strong> This action will instantly:
                <ul>
                  <li>Block user authentication services (cannot log in).</li>
                  <li>Deactivate their matching employee profile.</li>
                  <li>Terminate all overlapping allocations today.</li>
                </ul>
              </div>

              <div style={styles.actionsRow}>
                <button type="button" onClick={() => setSelectedUserForDeactivate(null)}>Cancel</button>
                <button
                  type="button"
                  onClick={handleDeactivate}
                  style={styles.deactivateConfirmButton}
                >
                  Deactivate login
                </button>
              </div>
            </div>
          )}

          {selectedUserForReactivate && (
            <div className="card" style={styles.reactivatePanel}>
              <h3 style={styles.reactivateTitle}>Reactivate Account?</h3>
              <p>
                Re-authorize access for user <strong>{selectedUserForReactivate.username}</strong>?
              </p>

              <p style={styles.reactivateNote}>
                <strong>Note:</strong> Previous allocations are NOT restored automatically. The resource profile status resets to BENCH. You will need to manually configure allocations if desired.
              </p>

              <div style={styles.actionsRow}>
                <button type="button" onClick={() => setSelectedUserForReactivate(null)}>Cancel</button>
                <button
                  type="button"
                  onClick={handleReactivate}
                  style={styles.reactivateConfirmButton}
                >
                  Confirm reactivation
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="card max-w-xl" style={styles.provisionFormCard}>
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
    </div>
  );
}
