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
  frozenBanner: {
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    padding: "15px",
    borderRadius: "6px",
    border: "1px solid #fca5a5",
    marginBottom: "20px",
    fontWeight: "bold" as const,
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
  emptyCard: {
    textAlign: "center" as const,
    padding: "30px",
  },
  emptyText: {
    margin: 0,
    color: COLORS.text.muted,
  },
  projectCard: {
    borderLeft: `4px solid ${COLORS.status.info}`,
  },
  projectTitle: {
    margin: "0 0 10px 0",
  },
  projectMeta: {
    margin: "0 0 15px 0",
    fontSize: "13px",
    color: COLORS.text.muted,
  },
  inputSection: {
    marginBottom: "15px",
  },
  inputLabel: {
    display: "block",
    fontWeight: "bold" as const,
    marginBottom: "5px",
  },
  numberInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  tagsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "8px",
    marginBottom: "10px",
  },
  tagLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },
  customTagInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  errorBanner: {
    color: COLORS.status.error,
    backgroundColor: "#fee2e2",
    padding: "10px",
    borderRadius: "4px",
  },
  successBanner: {
    color: COLORS.status.success,
    backgroundColor: "#dcfce7",
    padding: "10px",
    borderRadius: "4px",
  },
  submitButton: (isFrozen: boolean, submitting: boolean) => ({
    width: "100%",
    padding: "12px",
    backgroundColor: isFrozen ? "#9ca3af" : COLORS.status.info,
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold" as const,
    cursor: (submitting || isFrozen) ? "not-allowed" : "pointer",
    opacity: isFrozen ? 0.6 : 1,
  }),
};
