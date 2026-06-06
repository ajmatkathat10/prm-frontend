// Design System Colors
export const COLORS = {
  primary: {
    DEFAULT: "#4F46E5", // Indigo 600
    hover: "#4338CA",   // Indigo 700
    light: "#EEF2FF",   // Indigo 50
    dark: "#3730A3",    // Indigo 800
  },
  secondary: {
    DEFAULT: "#10B981", // Emerald 500
    hover: "#059669",   // Emerald 600
  },
  background: {
    default: "#0F172A", // Slate 900 (Dark Mode Default)
    card: "#1E293B",    // Slate 800
    glass: "rgba(30, 41, 59, 0.7)", // For glassmorphism
  },
  text: {
    primary: "#F8FAFC", // Slate 50
    secondary: "#94A3B8", // Slate 400
    muted: "#64748B",     // Slate 500
  },
  status: {
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
  },
  border: {
    default: "#334155", // Slate 700
    focus: "#6366F1",   // Indigo 500
  }
} as const;
