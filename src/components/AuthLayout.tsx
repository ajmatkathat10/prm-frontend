import { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
    return (
      <div className="min-h-screen bg-slate-955 text-slate-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col relative overflow-hidden">
      {/* Navigation */}
      <nav className="p-6 relative z-20">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {STRINGS.COMMON.BACK}
        </Link>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
