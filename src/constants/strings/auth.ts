export const AUTH_STRINGS = {
  LOGIN_TITLE: "Welcome Back",
  LOGIN_SUBTITLE: "Sign in to manage your resources and projects.",
  SIGNUP_TITLE: "Create an Account",
  SIGNUP_SUBTITLE: "Join the platform to manage or log your work.",
  LOGIN_BUTTON: "Sign In",
  SIGNUP_BUTTON: "Sign Up",
  NO_ACCOUNT: "Don't have an account?",
  HAVE_ACCOUNT: "Already have an account?",
  USERNAME_LABEL: "Username",
  PASSWORD_LABEL: "Password",
  FULL_NAME_LABEL: "Full Name",
  EMAIL_LABEL: "Email Address",
  ROLE_LABEL: "Account Role",
  FORGOT_PASSWORD: "Forgot password?",

  // New addition inputs & placeholders
  USERNAME_OR_EMAIL: "Username or Email",
  USERNAME_PLACEHOLDER: "admin or admin@techserve.com",
  PASSWORD_PLACEHOLDER: "••••••••",
  SIGNING_IN: "Signing in...",
  SAVING: "Saving…",

  // Errors
  NETWORK_ERROR: "Network error. Please check your connection.",
  ERROR_PASSWORD_MIN_LENGTH: "Password must be at least 8 characters.",
  ERROR_PASSWORDS_DONT_MATCH: "Passwords do not match.",
  ERROR_PASSWORDS_MISMATCH: "Passwords do not match",
  PASSWORDS_MATCH: "✓ Passwords match",

  // Registration Policies (SignUpPage)
  REGISTRATION_DISABLED: "Registration Disabled",
  REGISTRATION_DISABLED_SUBTITLE: "Self-registration is disabled for this system.",
  REGISTRATION_POLICY_PREFIX: "In accordance with organizational security policies, accounts for the",
  REGISTRATION_POLICY_MID: "can only be created and provisioned by a",
  REGISTRATION_CONTACT: "Please contact your Delivery Manager, Operations team, or System Administrator to request an account.",
  BACK_TO_SIGN_IN: "Back to Sign In",

  // Password Strength and Change (ChangePasswordPage)
  CHANGE_PASSWORD_TITLE: "Set New Password",
  CHANGE_PASSWORD_SUBTITLE: "This is your first login. You must set a new secure password to continue.",
  PASSWORD_UPDATED: "Password Updated!",
  REDIRECTING_DASHBOARD: "Redirecting to your dashboard…",
  NEW_PASSWORD_LABEL: "New Password",
  CONFIRM_PASSWORD_LABEL: "Confirm Password",
  SAVE_AND_CONTINUE: "Save & Continue to Dashboard",

  // Password checker rules
  PASSWORD_CHECK_MIN_LENGTH: "At least 8 characters",
  PASSWORD_CHECK_UPPERCASE: "Contains uppercase letter",
  PASSWORD_CHECK_LOWERCASE: "Contains lowercase letter",
  PASSWORD_CHECK_NUMBER: "Contains a number",
  PASSWORD_STRENGTH_WEAK: "Weak",
  PASSWORD_STRENGTH_FAIR: "Fair",
  PASSWORD_STRENGTH_GOOD: "Good",
  PASSWORD_STRENGTH_STRONG: "Strong",
  PASSWORD_STRENGTH_TOO_WEAK: "Too weak",
} as const;
