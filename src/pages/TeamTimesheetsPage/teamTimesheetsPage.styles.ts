import { COLORS } from "@/constants/colors";

export const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  headerSubtitle: {
    color: COLORS.text.muted,
    marginBottom: "20px",
  },
  filterCard: {
    marginBottom: "20px",
  },
  filterLabel: {
    display: "block",
    fontWeight: "bold" as const,
    marginBottom: "5px",
  },
  filterSelect: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  emptyMessage: {
    color: COLORS.text.muted,
    marginTop: "15px",
    textAlign: "center" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginTop: "15px",
    textAlign: "left" as const,
    fontSize: "14px",
  },
  tableHeaderRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  th: {
    padding: "8px",
  },
  thCentered: {
    padding: "8px",
    textAlign: "center" as const,
  },
  thRightAligned: {
    padding: "8px",
    textAlign: "right" as const,
  },
  tableBodyRow: {
    borderBottom: "1px solid #f3f4f6",
  },
  tdEmployeeName: {
    padding: "8px",
    fontWeight: "500",
  },
  tdProject: {
    padding: "8px",
  },
  tdHours: {
    padding: "8px",
    textAlign: "center" as const,
  },
  tdStatus: {
    padding: "8px",
    textAlign: "right" as const,
  },
  badge: (isMissed: boolean) => ({
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "bold" as const,
    backgroundColor: isMissed ? "#fee2e2" : "#d1fae5",
    color: isMissed ? "#991b1b" : "#065f46",
  }),
};
