import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { STRINGS } from "@/constants/strings";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_DASHBOARD_ROUTES } from "@/types/auth";
import { Spinner } from "@/components/ui/Spinner";
import { styles } from "./welcomePage.styles";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(ROLE_DASHBOARD_ROUTES[user.role] ?? "/dashboard");
    }
  }, [user, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div style={styles.container}>
      <Card>
        <CardHeader>
          <CardTitle>{STRINGS.APP_NAME}</CardTitle>
          <CardDescription>{STRINGS.APP_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/auth/login">
            <Button size="lg" style={styles.button}>
              {STRINGS.AUTH.LOGIN_BUTTON}
            </Button>
          </Link>
        </CardContent>
      </Card>
      <p style={styles.footerText}>
        {STRINGS.COMMON.LEARN_CODE_PROJECT}
      </p>
    </div>
  );
}
