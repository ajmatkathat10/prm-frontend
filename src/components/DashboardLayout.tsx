import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Clock,
  Settings,
  ShieldCheck,
  Briefcase,
  UserCircle,
  Cpu,
  History,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { STRINGS } from "@/constants/strings";
import { useDispatch } from "react-redux";
import { apiSlice } from "@/store/apiSlice";
import { Spinner } from "@/components/ui/Spinner";
import { Sidebar } from "./dashboard/Sidebar";
import { Header } from "./dashboard/Header";

// Navigation links per role
const navLinks: Record<string, { href: string; label: string; icon: React.ElementType }[]> = {
  ADMIN: [
    { href: "/dashboard/admin", label: STRINGS.DASHBOARD.OVERVIEW, icon: LayoutDashboard },
    { href: "/dashboard/admin/employees", label: STRINGS.DASHBOARD.ADMIN_OPTION_EMPLOYEES_LABEL, icon: Users },
    { href: "/dashboard/admin/projects", label: STRINGS.DASHBOARD.ADMIN_OPTION_PROJECTS_LABEL, icon: FolderKanban },
    { href: "/dashboard/admin/allocations", label: STRINGS.DASHBOARD.ADMIN_OPTION_ALLOCATIONS_LABEL, icon: Briefcase },
    { href: "/dashboard/admin/users", label: STRINGS.DASHBOARD.ADMIN_OPTION_USERS_LABEL, icon: UserCheck },
    { href: "/dashboard/admin/settings", label: STRINGS.DASHBOARD.ADMIN_OPTION_SETTINGS_LABEL, icon: Settings },
  ],
  MANAGER: [
    { href: "/dashboard/manager", label: STRINGS.DASHBOARD.OVERVIEW, icon: LayoutDashboard },
    { href: "/dashboard/manager/resources", label: STRINGS.DASHBOARD.MANAGER_OPTION_RESOURCES_LABEL, icon: Users },
    { href: "/dashboard/manager/allocate", label: STRINGS.DASHBOARD.MANAGER_OPTION_ALLOCATE_LABEL, icon: Briefcase },
    { href: "/dashboard/manager/projects", label: STRINGS.DASHBOARD.MANAGER_OPTION_PROJECTS_LABEL, icon: FolderKanban },
    { href: "/dashboard/manager/timesheets", label: STRINGS.DASHBOARD.MANAGER_OPTION_TIMESHEETS_LABEL, icon: Clock },
    { href: "/dashboard/manager/ai", label: STRINGS.DASHBOARD.MANAGER_OPTION_AI_LABEL, icon: Cpu },
  ],
  EMPLOYEE: [
    { href: "/dashboard/employee", label: STRINGS.DASHBOARD.OVERVIEW, icon: LayoutDashboard },
    { href: "/dashboard/employee/timesheet", label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_SUBMIT_TIMESHEET_LABEL, icon: Clock },
    { href: "/dashboard/employee/timesheets", label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_TIMESHEETS_LABEL, icon: History },
    { href: "/dashboard/employee/allocations", label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_ALLOCATIONS_LABEL, icon: Briefcase },
  ],
};

const roleConfig = {
  ADMIN: {
    label: STRINGS.ROLES.ADMIN_FULL,
    icon: ShieldCheck,
    color: "text-rose-400",
    bg: "bg-rose-600/20",
    border: "border-rose-500/30",
    badge: "bg-rose-900/40 text-rose-300 border-rose-700/50",
  },
  MANAGER: {
    label: STRINGS.ROLES.MANAGER_FULL,
    icon: Briefcase,
    color: "text-amber-400",
    bg: "bg-amber-600/20",
    border: "border-amber-500/30",
    badge: "bg-amber-900/40 text-amber-300 border-amber-700/50",
  },
  EMPLOYEE: {
    label: STRINGS.ROLES.EMPLOYEE_FULL,
    icon: UserCircle,
    color: "text-indigo-400",
    bg: "bg-indigo-600/20",
    border: "border-indigo-500/30",
    badge: "bg-indigo-900/40 text-indigo-300 border-indigo-700/50",
  },
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const { user, isLoading: isUserLoading, isError, logout, logoutStatus: { isLoading: loggingOut } } = useAuth();

  useEffect(() => {
    if (!isUserLoading) {
      if (isError || !user) {
        navigate("/auth/login");
      } else if (user.forcePasswordChange && pathname !== "/auth/change-password") {
        navigate("/auth/change-password");
      }
    }
  }, [user, isUserLoading, isError, navigate, pathname]);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Ignore logout errors
    } finally {
      dispatch(apiSlice.util.resetApiState());
      navigate("/auth/login");
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-955 text-slate-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const currentRole = user?.role ?? "EMPLOYEE";
  const sidebarNavigationItems = navLinks[currentRole] ?? [];
  const currentRoleConfig = roleConfig[currentRole];

  return (
    <div className="min-h-screen bg-slate-955 text-slate-50 flex">
      <Sidebar
        user={user}
        roleConfiguration={currentRoleConfig}
        sidebarNavigationItems={sidebarNavigationItems}
        pathname={pathname}
        handleLogout={handleLogout}
        loggingOut={loggingOut}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} roleConfiguration={currentRoleConfig} />
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
