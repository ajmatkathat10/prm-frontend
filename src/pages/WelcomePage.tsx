import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STRINGS } from "@/constants/strings";
import { Users, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_DASHBOARD_ROUTES } from "@/types/auth";
import { Spinner } from "@/components/ui/Spinner";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(ROLE_DASHBOARD_ROUTES[user.role] ?? "/dashboard");
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-955 text-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md">
        <Card className="border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="w-16 h-16 bg-slate-850 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700">
              <LayoutDashboard className="w-8 h-8 text-slate-300" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-100 mb-2">
              {STRINGS.APP_NAME}
            </CardTitle>
            <CardDescription className="text-slate-400 text-base">
              {STRINGS.APP_DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-10">
            <Link to="/auth/login" className="block">
              <Button size="lg" className="w-full text-lg h-12 gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700">
                <Users className="w-5 h-5" />
                {STRINGS.AUTH.LOGIN_BUTTON}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <p className="mt-12 text-slate-500 text-sm">
        {STRINGS.COMMON.LEARN_CODE_PROJECT}
      </p>
    </div>
  );
}
