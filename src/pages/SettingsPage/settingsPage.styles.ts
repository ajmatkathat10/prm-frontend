import { COLORS } from "@/constants/colors";

export const styles = {
  loadingMessage: {
    color: COLORS.text.muted,
  },
  layoutContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap" as const,
    marginTop: "15px",
  },
  summaryCard: {
    flex: "1",
    minWidth: "280px",
  },
  summaryList: {
    marginTop: "15px",
  },
  summaryItem: {
    marginBottom: "10px",
  },
  summaryLabel: {
    fontSize: "12px",
    color: COLORS.text.muted,
    display: "block",
    fontWeight: "bold" as const,
  },
  summaryValue: {
    fontSize: "14px",
    fontWeight: "bold" as const,
  },
  summaryValueMonospace: {
    fontSize: "12px",
    fontFamily: "monospace",
  },
  editorsContainer: {
    flex: "2",
    minWidth: "320px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  rowWrap: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap" as const,
    marginTop: "10px",
  },
  flexOneMinWidth150: {
    flex: "1",
    minWidth: "150px",
  },
  widthFull: {
    width: "100%",
  },
  flexOneMinWidth200: {
    flex: "1",
    minWidth: "200px",
  },
  flexRowGap8: {
    display: "flex",
    gap: "8px",
  },
  flexOneInput: {
    flex: "1",
  },
  flexOneMinWidth180: {
    flex: "1",
    minWidth: "180px",
  },
};
