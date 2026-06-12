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
  summaryCard: {
    marginBottom: "20px",
    backgroundColor: "#eff6ff",
    borderLeft: `4px solid ${COLORS.primary.DEFAULT}`,
  },
  summaryTitle: {
    margin: 0,
    color: "#1e3a8a",
  },
  summaryValue: {
    margin: "5px 0 0 0",
    fontSize: "24px",
    fontWeight: "bold" as const,
    color: COLORS.primary.DEFAULT,
  },
  summaryFooter: {
    fontSize: "13px",
    color: "#1e40af",
  },
  emptyCard: {
    textAlign: "center" as const,
    padding: "30px",
  },
  emptyText: {
    margin: 0,
    color: COLORS.text.muted,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  projectTitle: {
    margin: "0 0 5px 0",
  },
  metaText: {
    fontSize: "13px",
    color: COLORS.text.muted,
  },
  dateMetaText: {
    fontSize: "13px",
    color: COLORS.text.muted,
    marginTop: "5px",
  },
  badge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold" as const,
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
};
