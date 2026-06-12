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
  gridOneCol: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  cardTitleNoTopMargin: {
    marginTop: 0,
  },
  gridAutoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },
  infoLabel: {
    fontSize: "12px",
    color: COLORS.text.muted,
    display: "block",
  },
  infoValue: {
    fontSize: "16px",
  },
  formContainer: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  fieldLabel: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  textInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  gridTwoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  selectInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  errorBanner: {
    color: COLORS.status.error,
    backgroundColor: "#fee2e2",
    padding: "8px",
    borderRadius: "4px",
  },
  successBanner: {
    color: COLORS.status.success,
    backgroundColor: "#dcfce7",
    padding: "8px",
    borderRadius: "4px",
  },
  submitButton: (addingSkill: boolean) => ({
    padding: "10px 15px",
    backgroundColor: COLORS.status.info,
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold" as const,
    cursor: addingSkill ? "not-allowed" : "pointer",
    alignSelf: "flex-start" as const,
  }),
  emptyMessage: {
    margin: "15px 0 0 0",
    color: COLORS.text.muted,
  },
  skillsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    marginTop: "15px",
  },
  skillRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
  },
  skillName: {
    fontSize: "15px",
  },
  skillCategory: {
    fontSize: "11px",
    color: COLORS.text.muted,
    marginLeft: "10px",
    textTransform: "uppercase" as const,
  },
  actionsWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  proficiencySelect: {
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  removeButton: {
    backgroundColor: COLORS.status.error,
    color: "white",
    border: "none",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
  },
};
