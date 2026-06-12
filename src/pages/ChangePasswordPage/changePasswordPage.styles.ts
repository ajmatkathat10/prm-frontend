import { COLORS } from "@/constants/colors";

export const styles = {
  successWrapper: {
    textAlign: "center" as const,
    padding: "20px",
  },
  inputWrapper: {
    display: "flex",
    gap: "5px",
  },
  confirmSection: {
    marginTop: "10px",
  },
  errorText: {
    color: COLORS.status.error,
    fontSize: "12px",
    margin: "5px 0 0 0",
  },
  successText: {
    color: COLORS.status.success,
    fontSize: "12px",
    margin: "5px 0 0 0",
  },
  submitButton: {
    width: "100%",
    marginTop: "20px",
  },
};
