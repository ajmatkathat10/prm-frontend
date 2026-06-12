import { COLORS } from "@/constants/colors";

export const styles = {
  resetPanel: {
    marginTop: "20px",
    border: "1px solid #999",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ccc",
    paddingBottom: "10px",
    marginBottom: "15px",
  },
  panelTitle: {
    margin: 0,
  },
  panelSubtitle: {
    margin: "5px 0 0 0",
    fontSize: "12px",
    color: COLORS.text.muted,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  inputWithButtonRow: {
    display: "flex",
    gap: "8px",
  },
  flexOneInput: {
    flex: 1,
  },
  actionsRow: {
    display: "flex",
    gap: "10px",
  },
  deactivatePanel: {
    marginTop: "20px",
    border: `1px solid ${COLORS.status.error}`,
    backgroundColor: "#fff5f5",
  },
  deactivateTitle: {
    color: COLORS.status.error,
    margin: "0 0 10px 0",
  },
  warningCallout: {
    borderLeft: `3px solid ${COLORS.status.error}`,
    paddingLeft: "10px",
    margin: "15px 0",
    fontSize: "13px",
    color: "#660000",
  },
  deactivateConfirmButton: {
    backgroundColor: COLORS.status.error,
    color: "#ffffff",
    borderColor: COLORS.status.error,
  },
  reactivatePanel: {
    marginTop: "20px",
    border: `1px solid ${COLORS.status.success}`,
    backgroundColor: "#f5fff5",
  },
  reactivateTitle: {
    color: COLORS.status.success,
    margin: "0 0 10px 0",
  },
  reactivateNote: {
    fontSize: "13px",
    color: "#333",
  },
  reactivateConfirmButton: {
    backgroundColor: COLORS.status.success,
    color: "#ffffff",
    borderColor: COLORS.status.success,
  },
  provisionFormCard: {
    padding: "20px",
  },
};
