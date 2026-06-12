import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { styles } from "./spinner.styles";

interface SpinnerProps {
  text?: string;
  size?: "sm" | "md";
  className?: string;
  global?: boolean;
}

export function Spinner({ text, size = "md", className = "", global = false }: SpinnerProps) {
  const isPending = useSelector((state: RootState) => {
    if (!global) return false;
    return state.spinner.isVisible;
  });

  if (global && !isPending) return null;

  const displayText = text || (size === "sm" ? "..." : "Loading...");

  if (global) {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          Processing...
        </div>
      </div>
    );
  }

  return (
    <span
      className={className}
      style={size === "sm" ? styles.textSm : styles.textMd}
    >
      ({displayText})
    </span>
  );
}
