import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STRINGS } from "@/constants/strings";
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
    <Card>
      <CardHeader>
        <CardTitle>{STRINGS.AUTH.LOGIN_TITLE}</CardTitle>
        <CardDescription>{STRINGS.AUTH.LOGIN_SUBTITLE}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin}>
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="login-username">{STRINGS.AUTH.USERNAME_OR_EMAIL}</label>
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

          <div style={{ marginTop: "10px" }}>
            <label htmlFor="login-password">{STRINGS.AUTH.PASSWORD_LABEL}</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <Button
            id="login-submit"
            type="submit"
            style={{ width: "100%", marginTop: "20px" }}
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
