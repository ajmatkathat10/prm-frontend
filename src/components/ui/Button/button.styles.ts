import type { CSSProperties } from "react";

export const styles = {
  button: (variant: "default" | "outline" | "ghost" | "link" = "default", size: "default" | "sm" | "lg" | "icon" = "default"): CSSProperties => ({
    margin: "2px",
    textDecoration: variant === "link" ? "none" : undefined,
    background: variant === "link" || variant === "ghost" ? "none" : undefined,
    border: variant === "link" || variant === "ghost" ? "none" : undefined,
    padding: size === "sm" ? "4px 8px" : size === "lg" ? "10px 20px" : undefined,
  }),
};
