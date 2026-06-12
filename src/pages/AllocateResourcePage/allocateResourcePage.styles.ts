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
  errorBanner: {
    color: COLORS.status.error,
    backgroundColor: "#fee2e2",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  successBanner: {
    color: COLORS.status.success,
    backgroundColor: "#dcfce7",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  gridOneCol: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
    marginTop: "15px",
  },
  gridTwoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  fieldLabel: {
    display: "block",
    fontWeight: "bold" as const,
    marginBottom: "5px",
  },
  widthFullInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  gridThreeCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "15px",
  },
  submitButton: (creating: boolean) => ({
    padding: "10px 20px",
    backgroundColor: COLORS.status.info,
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold" as const,
    cursor: creating ? "not-allowed" : "pointer",
    alignSelf: "flex-start" as const,
  }),
  cardSection: {
    marginTop: "15px",
  },
  projectSelectWithMargin: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  noAllocationsMessage: {
    color: COLORS.text.muted,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "14px",
    textAlign: "left" as const,
  },
  tableHeaderRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  th: {
    padding: "8px",
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
  tdUtil: {
    padding: "8px",
  },
  tdDates: {
    padding: "8px",
    fontSize: "12px",
    color: COLORS.text.muted,
  },
  tdAction: {
    padding: "8px",
    textAlign: "right" as const,
  },
  endAllocationButton: {
    padding: "4px 8px",
    backgroundColor: COLORS.status.error,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
};
