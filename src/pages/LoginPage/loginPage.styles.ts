import { COLORS } from "@/constants/colors";

export const styles = {
  submitButton: {
    width: "100%",
    marginTop: "20px",
  },
  cancelButton: {
    width: "100%",
    marginTop: "10px",
    background: "none",
    border: "none",
    color: COLORS.primary.DEFAULT,
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
  },
  passwordFieldContainer: {
    marginTop: "10px",
  },
  passwordInputWrapper: {
    display: "flex",
    gap: "5px",
  },
};
