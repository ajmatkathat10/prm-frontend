import { COLORS } from "@/constants/colors";

export const styles = {
  flexColGap15: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  filterRow: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    flexWrap: "wrap" as const,
  },
  loadingOrEmpty: {
    padding: "20px",
    color: COLORS.text.muted,
  },
  rightAlign: {
    textAlign: "right" as const,
  },
  resourceName: {
    fontWeight: "bold" as const,
  },
  currentUserLabel: {
    fontSize: "12px",
    color: COLORS.text.muted,
  },
  skillsPanel: {
    marginTop: "10px",
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
  noSkillsMessage: {
    fontStyle: "italic",
    color: COLORS.text.muted,
  },
  skillsList: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
    marginBottom: "15px",
  },
  skillCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    minWidth: "220px",
    margin: 0,
    padding: "8px 12px",
  },
  skillName: {
    fontWeight: "bold" as const,
  },
  skillProficiency: {
    fontSize: "11px",
    color: "#0066cc",
    fontWeight: "bold" as const,
  },
  flexRowGap5: {
    display: "flex",
    gap: "5px",
  },
  profSelect: {
    padding: "2px",
    fontSize: "12px",
  },
  removeSkillButton: {
    color: COLORS.status.error,
    borderColor: COLORS.status.error,
    padding: "2px 6px",
    fontSize: "12px",
  },
  formDivider: {
    borderTop: "1px solid #ccc",
    paddingTop: "15px",
  },
  addSkillForm: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap" as const,
    alignItems: "flex-end",
  },
  deactivatePanel: {
    marginTop: "10px",
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
  flexRowGap10: {
    display: "flex",
    gap: "10px",
  },
  deactivateConfirmButton: {
    backgroundColor: COLORS.status.error,
    color: "#ffffff",
    borderColor: COLORS.status.error,
  },
  assignCard: {
    maxWidth: "600px",
  },
  assignSubtitle: {
    color: COLORS.text.muted,
    fontSize: "14px",
    marginBottom: "15px",
  },
  assignSelect: {
    width: "105%",
  },
  assignSubmitRow: {
    marginTop: "15px",
  },
};
