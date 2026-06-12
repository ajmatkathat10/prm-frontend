import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { STRINGS } from "@/constants/strings";
import { ROLE_DASHBOARD_ROUTES } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";
import { useVerifyOtpMutation } from "@/store/services/authApiSlice";
import { styles } from "./loginPage.styles";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loginStatus: { isLoading } } = useAuth();

  const [otpRequired, setOtpRequired] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await login({ username, password }).unwrap();

      if (res.otpRequired) {
        setOtpRequired(true);
        setTempUserId(res.userId || null);
      } else {
        const sessionUser = res.user;
        if (sessionUser) {
          if (sessionUser.forcePasswordChange) {
            navigate("/auth/change-password");
          } else {
            navigate(ROLE_DASHBOARD_ROUTES[sessionUser.role] ?? "/dashboard");
          }
        }
      }
    } catch (err) {
      const errorObj = err as { data?: { error?: string } } | null | undefined;
      const errorMessage = errorObj?.data?.error ?? STRINGS.AUTH.NETWORK_ERROR;
      setError(errorMessage);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tempUserId || !otp) {
      return;
    }

    try {
      const user = await verifyOtp({ userId: tempUserId, otp }).unwrap();
      if (user.forcePasswordChange) {
        navigate("/auth/change-password");
      } else {
        navigate(ROLE_DASHBOARD_ROUTES[user.role] ?? "/dashboard");
      }
    } catch (err) {
      const errorObj = err as { data?: { error?: string } } | null | undefined;
      const errorMessage = errorObj?.data?.error ?? "Invalid or expired OTP. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{otpRequired ? "Email Verification" : STRINGS.AUTH.LOGIN_TITLE}</CardTitle>
        <CardDescription>
          {otpRequired
            ? "We have sent a 6-digit verification code (OTP) to your email. Please enter it below to proceed."
            : STRINGS.AUTH.LOGIN_SUBTITLE}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {otpRequired ? (
          <form onSubmit={handleVerifyOtp}>
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-otp">Enter 6-Digit OTP</label>
              <Input
                id="login-otp"
                type="text"
                placeholder="e.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                pattern="\d{6}"
                disabled={isVerifying}
              />
            </div>

            <Button
              id="otp-submit"
              type="submit"
              style={styles.submitButton}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <Spinner size="sm" text="Verifying..." />
              ) : (
                "Verify OTP"
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setOtpRequired(false);
                setOtp("");
                setTempUserId(null);
                setError(null);
              }}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </form>
        ) : (
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

            <div style={styles.passwordFieldContainer}>
              <label htmlFor="login-password">{STRINGS.AUTH.PASSWORD_LABEL}</label>
              <div style={styles.passwordInputWrapper}>
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
              style={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner size="sm" text={STRINGS.AUTH.SIGNING_IN} />
              ) : (
                STRINGS.AUTH.LOGIN_BUTTON
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
