import { COLORS } from "@/constants/colors";

export const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  headerSubtitle: {
    color: COLORS.text.muted,
    marginBottom: "20px",
  },
  emptyCard: {
    textAlign: "center" as const,
    padding: "30px",
  },
  emptyText: {
    margin: 0,
    color: COLORS.text.muted,
  },
  cardContainer: (isMissed: boolean) => ({
    borderLeft: isMissed ? `4px solid ${COLORS.status.warning}` : `4px solid ${COLORS.status.success}`,
    backgroundColor: isMissed ? "#fffbeb" : "white",
  }),
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  title: {
    margin: 0,
  },
  metaText: {
    fontSize: "13px",
    color: COLORS.text.muted,
  },
  badgeAndButtonRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  badge: (isMissed: boolean) => ({
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold" as const,
    backgroundColor: isMissed ? "#fef3c7" : "#d1fae5",
    color: isMissed ? "#b45309" : "#065f46",
  }),
  toggleButton: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
  },
  expandedSection: {
    marginTop: "15px",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "15px",
  },
  missedWarning: {
    margin: 0,
    color: "#b45309",
    fontSize: "13px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "14px",
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
  tdProjectName: {
    padding: "8px 0",
    fontWeight: "500",
  },
  tdHours: {
    padding: "8px 0",
  },
  tdTags: {
    padding: "8px 0",
  },
  tagsWrapper: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap" as const,
  },
  tag: {
    fontSize: "11px",
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: "2px 6px",
    borderRadius: "4px",
  },
};
