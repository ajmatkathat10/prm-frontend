import { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { STRINGS } from "@/constants/strings";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_DASHBOARD_ROUTES } from "@/types/auth";
import { Spinner } from "@/components/ui/Spinner";

export default function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.forcePasswordChange) {
        if (pathname !== "/auth/change-password") {
          navigate("/auth/change-password");
        }
      } else {
        navigate(ROLE_DASHBOARD_ROUTES[user.role] ?? "/dashboard");
      }
    }
  }, [user, navigate, pathname]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">← {STRINGS.COMMON.BACK}</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
