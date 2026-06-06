import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { ROLE_DASHBOARD_ROUTES } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { STRINGS } from "@/constants/strings";
import { Spinner } from "@/components/ui/Spinner";

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

      // Show success briefly then redirect to role-specific dashboard
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
    <Card className="border-slate-800 bg-slate-900 shadow-xl">
      <CardHeader className="text-center pb-6 pt-8">
        <div className="w-14 h-14 bg-slate-850 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-700">
          <ShieldCheck className="w-7 h-7 text-slate-300" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-50">{STRINGS.AUTH.CHANGE_PASSWORD_TITLE}</CardTitle>
        <CardDescription className="text-slate-400">
          {STRINGS.AUTH.CHANGE_PASSWORD_SUBTITLE}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="w-16 h-16 bg-slate-850 rounded-full flex items-center justify-center border border-slate-700">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-semibold text-lg">{STRINGS.AUTH.PASSWORD_UPDATED}</p>
            <p className="text-slate-400 text-sm">{STRINGS.AUTH.REDIRECTING_DASHBOARD}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 bg-red-950/40 border border-red-800/60 text-red-300 text-sm rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">{STRINGS.AUTH.NEW_PASSWORD_LABEL}</label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">{STRINGS.AUTH.CONFIRM_PASSWORD_LABEL}</label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`pr-10 ${
                    confirmPassword && confirmPassword !== newPassword
                      ? "border-red-500/50"
                      : confirmPassword && confirmPassword === newPassword
                      ? "border-emerald-500/50"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-450">{STRINGS.AUTH.ERROR_PASSWORDS_MISMATCH}</p>
              )}
              {confirmPassword && confirmPassword === newPassword && (
                <p className="text-xs text-emerald-450">{STRINGS.AUTH.PASSWORDS_MATCH}</p>
              )}
            </div>

            <Button
              id="change-password-submit"
              type="submit"
              className="w-full mt-2 h-11 text-base font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
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
