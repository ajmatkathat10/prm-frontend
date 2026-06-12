import { COLORS } from "@/constants/colors";

export const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    textAlign: "center" as const,
    fontFamily: "sans-serif",
  },
  button: {
    width: "100%",
  },
  footerText: {
    marginTop: "20px",
    color: COLORS.text.muted,
    fontSize: "12px",
  },
};
