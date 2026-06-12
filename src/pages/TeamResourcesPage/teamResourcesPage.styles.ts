import { COLORS } from "@/constants/colors";

export const styles = {
  container: {
    maxWidth: "1000px",
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
  frozenAlert: {
    backgroundColor: "#fee2e2",
    border: "1px solid #fca5a5",
    padding: "12px",
    borderRadius: "6px",
    margin: "15px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  frozenAlertText: {
    color: "#b91c1c",
    fontWeight: "bold" as const,
  },
  frozenRestoreButton: (restoring: boolean) => ({
    padding: "6px 12px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: restoring ? "not-allowed" : "pointer",
    fontSize: "13px",
    fontWeight: "bold" as const,
  }),
  drilldownGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "15px",
    margin: "15px 0",
  },
  drilldownLabel: {
    fontSize: "12px",
    color: COLORS.text.muted,
    display: "block",
  },
  drilldownStatus: (status: string) => ({
    color: status === "BENCH" ? COLORS.status.warning : COLORS.primary.DEFAULT,
  }),
  section: {
    marginTop: "20px",
  },
  emptyText: {
    color: COLORS.text.muted,
  },
  emptyTextBench: {
    color: COLORS.text.muted,
    margin: "15px 0 0 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "14px",
    marginTop: "10px",
  },
  tableHeaderRow: {
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left" as const,
  },
  th: {
    padding: "8px 0",
  },
  tableBodyRow: {
    borderBottom: "1px solid #f3f4f6",
  },
  tdName: {
    padding: "8px 0",
    fontWeight: "500",
  },
  tdValue: {
    padding: "8px 0",
  },
  tagsContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
    marginTop: "10px",
  },
  activityTag: {
    fontSize: "12px",
    backgroundColor: "#eff6ff",
    color: "#1e40af",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #bfdbfe",
  },
  benchGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  benchHeader: {
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "10px",
  },
  benchTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginTop: "15px",
    textAlign: "left" as const,
  },
  benchTh: {
    padding: "8px",
  },
  benchThRight: {
    padding: "8px",
    textAlign: "right" as const,
  },
  benchTd: {
    padding: "8px",
  },
  benchTdBold: {
    padding: "8px",
    fontWeight: "500",
  },
  benchTdRight: {
    padding: "8px",
    textAlign: "right" as const,
  },
  frozenBadge: {
    marginLeft: "8px",
    fontSize: "11px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid #fca5a5",
    fontWeight: "bold" as const,
  },
  actionsWrapper: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  restoreAccessButton: (restoring: boolean) => ({
    padding: "4px 8px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: restoring ? "not-allowed" : "pointer",
    fontSize: "13px",
    fontWeight: "bold" as const,
  }),
  drillDetailsButton: {
    padding: "4px 8px",
    backgroundColor: COLORS.status.info,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  allocatedBadge: {
    backgroundColor: "#eff6ff",
    color: "#1e40af",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "bold" as const,
  },
  benchTdCentered: {
    padding: "8px",
    textAlign: "center" as const,
  },
  benchThCentered: {
    padding: "8px",
    textAlign: "center" as const,
  },
};
