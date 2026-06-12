import { COLORS } from "@/constants/colors";

export const styles = {
  optionsContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "15px",
    marginTop: "15px",
  },
  optionTitle: {
    margin: "0 0 5px 0",
  },
  optionDescription: {
    margin: 0,
    fontSize: "14px",
    color: COLORS.text.muted,
  },
};
