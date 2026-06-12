import { COLORS } from "@/constants/colors";

export const styles = {
  filterRow: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    flexWrap: "wrap" as const,
  },
  inlineLabel: {
    display: "inline",
    marginRight: "5px",
  },
  loadingOrEmpty: {
    padding: "20px",
    color: COLORS.text.muted,
  },
  resourceCell: {
    fontWeight: "bold" as const,
  },
  projectCell: {
    color: COLORS.status.success,
    fontWeight: "bold" as const,
  },
  utilizationCell: {
    fontWeight: "bold" as const,
  },
  statusText: (isActive: boolean) => ({
    color: isActive ? COLORS.status.success : COLORS.text.muted,
    fontWeight: "bold" as const,
  }),
  summaryFooter: {
    fontSize: "12px",
    color: COLORS.text.muted,
    marginTop: "10px",
  },
};
