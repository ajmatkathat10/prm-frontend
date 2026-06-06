import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";
import { ROLE_DASHBOARD_ROUTES } from "@/types/auth";
import { Spinner } from "@/components/ui/Spinner";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading, isError } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-955 text-slate-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user.forcePasswordChange && location.pathname !== "/auth/change-password") {
    return <Navigate to="/auth/change-password" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const defaultRoute = ROLE_DASHBOARD_ROUTES[user.role] ?? "/dashboard";
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
}
