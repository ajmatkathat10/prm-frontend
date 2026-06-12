import { Link } from "react-router-dom";
import { STRINGS } from "@/constants/strings";
import { styles } from "./managerDashboard.styles";

const managerOptions = [
  {
    href: "/dashboard/manager/resources",
    label: STRINGS.DASHBOARD.MANAGER_OPTION_RESOURCES_LABEL,
    description: STRINGS.DASHBOARD.MANAGER_OPTION_RESOURCES_DESC,
  },
  {
    href: "/dashboard/manager/allocate",
    label: STRINGS.DASHBOARD.MANAGER_OPTION_ALLOCATE_LABEL,
    description: STRINGS.DASHBOARD.MANAGER_OPTION_ALLOCATE_DESC,
  },
  {
    href: "/dashboard/manager/projects",
    label: STRINGS.DASHBOARD.MANAGER_OPTION_PROJECTS_LABEL,
    description: STRINGS.DASHBOARD.MANAGER_OPTION_PROJECTS_DESC,
  },
  {
    href: "/dashboard/manager/timesheets",
    label: STRINGS.DASHBOARD.MANAGER_OPTION_TIMESHEETS_LABEL,
    description: STRINGS.DASHBOARD.MANAGER_OPTION_TIMESHEETS_DESC,
  },
  {
    href: "/dashboard/manager/ai",
    label: STRINGS.DASHBOARD.MANAGER_OPTION_AI_LABEL,
    description: STRINGS.DASHBOARD.MANAGER_OPTION_AI_DESC,
  },
];

export default function ManagerDashboard() {
  return (
    <div>
      <div>
        <h1>{STRINGS.DASHBOARD.PROJECTS_OVERVIEW}</h1>
      </div>

      <div style={styles.optionsContainer}>
        {managerOptions.map((option) => (
          <div key={option.label} className="card">
            <h2 style={styles.optionTitle}>
              <Link to={option.href}>{option.label}</Link>
            </h2>
            <p style={styles.optionDescription}>
              {option.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
