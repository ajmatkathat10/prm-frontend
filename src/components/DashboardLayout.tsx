import { useEffect } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { STRINGS } from "@/constants/strings";
import { useDispatch } from "react-redux";
import { apiSlice } from "@/store/apiSlice";
import { Spinner } from "@/components/ui/Spinner";

const navLinks: Record<string, { href: string; label: string }[]> = {
  ADMIN: [
    { href: "/dashboard/admin", label: STRINGS.DASHBOARD.OVERVIEW },
    { href: "/dashboard/admin/resources", label: STRINGS.DASHBOARD.ADMIN_OPTION_EMPLOYEES_LABEL },
    { href: "/dashboard/admin/projects", label: STRINGS.DASHBOARD.ADMIN_OPTION_PROJECTS_LABEL },
    { href: "/dashboard/admin/allocations", label: STRINGS.DASHBOARD.ADMIN_OPTION_ALLOCATIONS_LABEL },
    { href: "/dashboard/admin/users", label: STRINGS.DASHBOARD.ADMIN_OPTION_USERS_LABEL },
    { href: "/dashboard/admin/settings", label: STRINGS.DASHBOARD.ADMIN_OPTION_SETTINGS_LABEL },
  ],
  MANAGER: [
    { href: "/dashboard/manager", label: STRINGS.DASHBOARD.OVERVIEW },
    { href: "/dashboard/manager/resources", label: STRINGS.DASHBOARD.MANAGER_OPTION_RESOURCES_LABEL },
    { href: "/dashboard/manager/allocate", label: STRINGS.DASHBOARD.MANAGER_OPTION_ALLOCATE_LABEL },
    { href: "/dashboard/manager/projects", label: STRINGS.DASHBOARD.MANAGER_OPTION_PROJECTS_LABEL },
    { href: "/dashboard/manager/timesheets", label: STRINGS.DASHBOARD.MANAGER_OPTION_TIMESHEETS_LABEL },
    { href: "/dashboard/manager/ai", label: STRINGS.DASHBOARD.MANAGER_OPTION_AI_LABEL },
  ],
  EMPLOYEE: [
    { href: "/dashboard/employee", label: STRINGS.DASHBOARD.OVERVIEW },
    { href: "/dashboard/employee/timesheet", label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_SUBMIT_TIMESHEET_LABEL },
    { href: "/dashboard/employee/timesheets", label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_TIMESHEETS_LABEL },
    { href: "/dashboard/employee/allocations", label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_ALLOCATIONS_LABEL },
  ],
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch();

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

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.warn("Logout error occurred:", error);
    } finally {
      dispatch(apiSlice.util.resetApiState());
      navigate("/auth/login");
    }
  };

  if (isUserLoading || !user) {
    return <Spinner />;
  }

  const currentRole = user?.role ?? "EMPLOYEE";
  const navigationItems = navLinks[currentRole] ?? [];

  return (
    <div style={{ padding: "15px", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "15px" }}>
        <div>
          <strong>PRM System</strong> | {user.username} ({currentRole})
        </div>
        <nav style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {navigationItems.map(({ href, label }) => {
            const isActive = pathname === href || (href !== `/dashboard/${currentRole.toLowerCase()}` && pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                style={{
                  fontWeight: isActive ? "bold" : "normal",
                  textDecoration: "none"
                }}
              >
                {label}
              </Link>
            );
          })}
          <button onClick={handleLogout} disabled={loggingOut} style={{ marginLeft: "10px" }}>
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
