import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from '@/pages/WelcomePage';
import LoginPage from '@/pages/LoginPage';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import AdminDashboard from '@/pages/AdminDashboard';
import ResourcesPage from '@/pages/ResourcesPage';
import ProjectsPage from '@/pages/ProjectsPage';
import AllocationsPage from '@/pages/AllocationsPage';
import UsersPage from '@/pages/UsersPage';
import SettingsPage from '@/pages/SettingsPage';
import ManagerDashboard from '@/pages/ManagerDashboard';
import EmployeeDashboard from '@/pages/EmployeeDashboard';
import AuthLayout from '@/components/AuthLayout';
import DashboardLayout from '@/components/DashboardLayout';
import RoleGuard from '@/components/RoleGuard';
import { Spinner } from '@/components/ui/Spinner';

function App() {
  return (
    <Router>
      <Spinner global />
      <Routes>
        <Route path="/" element={<WelcomePage />} />

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="" element={<Navigate to="/auth/login" replace />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route
            path="admin"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="admin/resources"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <ResourcesPage />
              </RoleGuard>
            }
          />
          <Route
            path="admin/employees"
            element={<Navigate to="/dashboard/admin/resources" replace />}
          />
          <Route
            path="admin/projects"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <ProjectsPage />
              </RoleGuard>
            }
          />
          <Route
            path="admin/allocations"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <AllocationsPage />
              </RoleGuard>
            }
          />
          <Route
            path="admin/users"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <UsersPage />
              </RoleGuard>
            }
          />
          <Route
            path="admin/settings"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <SettingsPage />
              </RoleGuard>
            }
          />
          <Route
            path="manager"
            element={
              <RoleGuard allowedRoles={['MANAGER']}>
                <ManagerDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="employee"
            element={
              <RoleGuard allowedRoles={['EMPLOYEE']}>
                <EmployeeDashboard />
              </RoleGuard>
            }
          />
          <Route path="" element={<Navigate to="employee" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
