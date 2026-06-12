import { COLORS } from "@/constants/colors";

export const styles = {
  container: {
    fontFamily: "sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  optionDescription: {
    color: COLORS.text.muted,
    fontSize: "14px",
  },
};
