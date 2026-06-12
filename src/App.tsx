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
import TeamResourcesPage from '@/pages/TeamResourcesPage';
import AllocateResourcePage from '@/pages/AllocateResourcePage';
import MyProjectsPage from '@/pages/MyProjectsPage';
import TeamTimesheetsPage from '@/pages/TeamTimesheetsPage';
import AiAssistantPage from '@/pages/AiAssistantPage';
import EmployeeDashboard from '@/pages/EmployeeDashboard';
import SubmitTimesheetPage from '@/pages/SubmitTimesheetPage';
import MyTimesheetsPage from '@/pages/MyTimesheetsPage';
import MyAllocationsPage from '@/pages/MyAllocationsPage';
import ProfilePage from '@/pages/ProfilePage';
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
            path="manager/resources"
            element={
              <RoleGuard allowedRoles={['MANAGER']}>
                <TeamResourcesPage />
              </RoleGuard>
            }
          />
          <Route
            path="manager/allocate"
            element={
              <RoleGuard allowedRoles={['MANAGER']}>
                <AllocateResourcePage />
              </RoleGuard>
            }
          />
          <Route
            path="manager/projects"
            element={
              <RoleGuard allowedRoles={['MANAGER']}>
                <MyProjectsPage />
              </RoleGuard>
            }
          />
          <Route
            path="manager/timesheets"
            element={
              <RoleGuard allowedRoles={['MANAGER']}>
                <TeamTimesheetsPage />
              </RoleGuard>
            }
          />
          <Route
            path="manager/ai"
            element={
              <RoleGuard allowedRoles={['MANAGER']}>
                <AiAssistantPage />
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
          <Route
            path="employee/timesheet"
            element={
              <RoleGuard allowedRoles={['EMPLOYEE']}>
                <SubmitTimesheetPage />
              </RoleGuard>
            }
          />
          <Route
            path="employee/timesheets"
            element={
              <RoleGuard allowedRoles={['EMPLOYEE']}>
                <MyTimesheetsPage />
              </RoleGuard>
            }
          />
          <Route
            path="employee/allocations"
            element={
              <RoleGuard allowedRoles={['EMPLOYEE']}>
                <MyAllocationsPage />
              </RoleGuard>
            }
          />
          <Route
            path="employee/profile"
            element={
              <RoleGuard allowedRoles={['EMPLOYEE']}>
                <ProfilePage />
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
