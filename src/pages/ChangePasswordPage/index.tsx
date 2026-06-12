import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { STRINGS } from "@/constants/strings";
import { Spinner } from "@/components/ui/Spinner";
import { ROLE_DASHBOARD_ROUTES } from "@/types/auth";
import { styles } from "./changePasswordPage.styles";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { changePassword, changePasswordStatus: { isLoading } } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError(STRINGS.AUTH.ERROR_PASSWORD_MIN_LENGTH);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(STRINGS.AUTH.ERROR_PASSWORDS_DONT_MATCH);
      return;
    }

    try {
      const user = await changePassword({ newPassword }).unwrap();

      setSuccess(true);
      setTimeout(() => {
        navigate(ROLE_DASHBOARD_ROUTES[user.role] ?? "/dashboard");
      }, 1800);
    } catch (err) {
      const errorObj = err as { data?: { error?: string } } | null | undefined;
      const errorMessage = errorObj?.data?.error ?? STRINGS.AUTH.NETWORK_ERROR;
      setError(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{STRINGS.AUTH.CHANGE_PASSWORD_TITLE}</CardTitle>
        <CardDescription>{STRINGS.AUTH.CHANGE_PASSWORD_SUBTITLE}</CardDescription>
      </CardHeader>

      <CardContent>
        {success ? (
          <div style={styles.successWrapper}>
            <p className="success-banner">{STRINGS.AUTH.PASSWORD_UPDATED}</p>
            <p>{STRINGS.AUTH.REDIRECTING_DASHBOARD}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="new-password">{STRINGS.AUTH.NEW_PASSWORD_LABEL}</label>
              <div style={styles.inputWrapper}>
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  tabIndex={-1}
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div style={styles.confirmSection}>
              <label htmlFor="confirm-password">{STRINGS.AUTH.CONFIRM_PASSWORD_LABEL}</label>
              <div style={styles.inputWrapper}>
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p style={styles.errorText}>{STRINGS.AUTH.ERROR_PASSWORDS_MISMATCH}</p>
              )}
              {confirmPassword && confirmPassword === newPassword && (
                <p style={styles.successText}>{STRINGS.AUTH.PASSWORDS_MATCH}</p>
              )}
            </div>

            <Button
              id="change-password-submit"
              type="submit"
              style={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner size="sm" text={STRINGS.AUTH.SAVING} />
              ) : (
                STRINGS.AUTH.SAVE_AND_CONTINUE
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
