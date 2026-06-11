import { Link } from "react-router-dom";
import { STRINGS } from "@/constants/strings";

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

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
        {managerOptions.map((option) => (
          <div key={option.label} className="card">
            <h2 style={{ margin: "0 0 5px 0" }}>
              <Link to={option.href}>{option.label}</Link>
            </h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
              {option.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

