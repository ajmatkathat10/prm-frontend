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
  backButton: {
    padding: "6px 12px",
    backgroundColor: "#e5e7eb",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "15px",
  },
  detailsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  healthBadge: (bg: string, text: string) => ({
    backgroundColor: bg,
    color: text,
    padding: "6px 12px",
    borderRadius: "4px",
    fontWeight: "bold" as const,
  }),
  description: {
    color: COLORS.text.muted,
    marginBottom: "20px",
  },
  section: {
    marginBottom: "20px",
  },
  scopeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginTop: "10px",
  },
  metaLabel: {
    fontSize: "12px",
    color: COLORS.text.muted,
    display: "block",
  },
  riskList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    marginTop: "10px",
  },
  riskRow: (valid: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    backgroundColor: valid ? "#f0fdf4" : "#fef2f2",
    color: valid ? "#166534" : "#991b1b",
    borderRadius: "4px",
    fontSize: "14px",
  }),
  riskStatusSymbol: {
    fontSize: "16px",
  },
  aiContainer: {
    marginTop: "10px",
  },
  aiButton: (generating: boolean) => ({
    padding: "8px 16px",
    backgroundColor: COLORS.status.info,
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold" as const,
    cursor: generating ? "not-allowed" : "pointer",
    marginBottom: "10px",
  }),
  aiResponseBox: {
    padding: "12px",
    borderLeft: `4px solid ${COLORS.status.warning}`,
    backgroundColor: "#fffbeb",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#78350f",
    lineHeight: "1.5",
    fontStyle: "italic",
  },
  emptyMessage: {
    color: COLORS.text.muted,
  },
  emptyMessageWithMargin: {
    color: COLORS.text.muted,
    marginTop: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "14px",
    marginTop: "10px",
    textAlign: "left" as const,
  },
  tableHeaderRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  th: {
    padding: "8px 0",
  },
  tableBodyRow: {
    borderBottom: "1px solid #f3f4f6",
  },
  tdTitle: {
    padding: "8px 0",
    fontWeight: "500",
  },
  tdDate: {
    padding: "8px 0",
  },
  tdStoryPoints: {
    padding: "8px 0",
  },
  tdStatus: {
    padding: "8px 0",
  },
  overdueText: {
    marginLeft: "10px",
    color: COLORS.status.error,
    fontWeight: "bold" as const,
    fontSize: "11px",
  },
  statusBadge: (status: string) => {
    let bg = "#f3f4f6";
    let color = "#374151";
    if (status === "DONE") {
      bg = "#d1fae5";
      color = "#065f46";
    } else if (status === "IN_PROGRESS") {
      bg = "#eff6ff";
      color = "#1e40af";
    }
    return {
      padding: "2px 6px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "bold" as const,
      backgroundColor: bg,
      color,
    };
  },
  listTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginTop: "15px",
    textAlign: "left" as const,
  },
  listTh: {
    padding: "8px",
  },
  listTd: {
    padding: "8px",
  },
  listTdBold: {
    padding: "8px",
    fontWeight: "500",
  },
  listBadge: (bg: string, text: string) => ({
    backgroundColor: bg,
    color: text,
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold" as const,
  }),
  listActionTd: {
    padding: "8px",
    textAlign: "right" as const,
  },
  viewDetailsButton: {
    padding: "4px 8px",
    backgroundColor: COLORS.status.info,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
};
