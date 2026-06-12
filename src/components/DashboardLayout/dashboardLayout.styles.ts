export const styles = {
  container: {
    padding: "15px",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
    paddingBottom: "10px",
    marginBottom: "15px",
  },
  nav: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  link: (isActive: boolean) => ({
    fontWeight: isActive ? ("bold" as const) : ("normal" as const),
    textDecoration: "none",
  }),
  logoutButton: {
    marginLeft: "10px",
  },
};
