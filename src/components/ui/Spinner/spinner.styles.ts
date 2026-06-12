import { COLORS } from "@/constants/colors";

export const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  card: {
    padding: "10px",
    border: "1px solid black",
    background: "white",
    fontWeight: "bold" as const,
  },
  textSm: {
    fontSize: "12px",
    color: COLORS.text.muted,
  },
  textMd: {
    fontSize: "14px",
    color: COLORS.text.muted,
  },
};
