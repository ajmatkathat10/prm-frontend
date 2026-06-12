import { COLORS } from "@/constants/colors";

export const styles = {
  reminderBanner: {
    border: `1px solid ${COLORS.status.warning}`,
    backgroundColor: "#fffbeb",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  reminderTitle: {
    color: "#b45309",
  },
  reminderDescription: {
    margin: "5px 0 0 0",
    fontSize: "13px",
    color: "#78350f",
  },
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
