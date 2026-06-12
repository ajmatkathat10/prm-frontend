import { Link } from "react-router-dom";
import { STRINGS } from "@/constants/strings";
import { styles } from "./adminDashboard.styles";

const adminOptions = [
  {
    href: "/dashboard/admin/resources",
    label: STRINGS.DASHBOARD.ADMIN_OPTION_EMPLOYEES_LABEL,
    description: STRINGS.DASHBOARD.ADMIN_OPTION_EMPLOYEES_DESC,
  },
  {
    href: "/dashboard/admin/projects",
    label: STRINGS.DASHBOARD.ADMIN_OPTION_PROJECTS_LABEL,
    description: STRINGS.DASHBOARD.ADMIN_OPTION_PROJECTS_DESC,
  },
  {
    href: "/dashboard/admin/allocations",
    label: STRINGS.DASHBOARD.ADMIN_OPTION_ALLOCATIONS_LABEL,
    description: STRINGS.DASHBOARD.ADMIN_OPTION_ALLOCATIONS_DESC,
  },
  {
    href: "/dashboard/admin/users",
    label: STRINGS.DASHBOARD.ADMIN_OPTION_USERS_LABEL,
    description: STRINGS.DASHBOARD.ADMIN_OPTION_USERS_DESC,
  },
  {
    href: "/dashboard/admin/settings",
    label: STRINGS.DASHBOARD.ADMIN_OPTION_SETTINGS_LABEL,
    description: STRINGS.DASHBOARD.ADMIN_OPTION_SETTINGS_DESC,
  },
];

export default function AdminDashboard() {
  return (
    <div style={styles.container}>
      <h1>{STRINGS.DASHBOARD.SYSTEM_CONTROL}</h1>
      <div style={styles.grid}>
        {adminOptions.map((option) => (
          <div key={option.label} className="card">
            <h3>
              <Link to={option.href}>{option.label}</Link>
            </h3>
            <p style={styles.optionDescription}>{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
