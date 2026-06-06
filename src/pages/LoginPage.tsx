import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STRINGS } from "@/constants/strings";
import { LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import { ROLE_DASHBOARD_ROUTES } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loginStatus: { isLoading } } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const user = await login({ username, password }).unwrap();

      if (user.forcePasswordChange) {
        navigate("/auth/change-password");
      } else {
        navigate(ROLE_DASHBOARD_ROUTES[user.role] ?? "/dashboard");
      }
    } catch (err) {
      const errorObj = err as { data?: { error?: string } } | null | undefined;
      const errorMessage = errorObj?.data?.error ?? STRINGS.AUTH.NETWORK_ERROR;
      setError(errorMessage);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900 shadow-xl">
      <CardHeader className="text-center pb-6 pt-8">
        <div className="w-14 h-14 bg-slate-850 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-700">
          <LogIn className="w-7 h-7 text-slate-300" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-50">
          {STRINGS.AUTH.LOGIN_TITLE}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {STRINGS.AUTH.LOGIN_SUBTITLE}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 bg-red-950/40 border border-red-800/60 text-red-300 text-sm rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              {STRINGS.AUTH.USERNAME_OR_EMAIL}
            </label>
            <Input
              id="login-username"
              type="text"
              placeholder={STRINGS.AUTH.USERNAME_PLACEHOLDER}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              {STRINGS.AUTH.PASSWORD_LABEL}
            </label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            id="login-submit"
            type="submit"
            className="w-full mt-2 h-11 text-base font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="sm" text={STRINGS.AUTH.SIGNING_IN} />
            ) : (
              STRINGS.AUTH.LOGIN_BUTTON
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
