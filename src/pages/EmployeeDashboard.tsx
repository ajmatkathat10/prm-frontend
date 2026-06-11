import { Link } from "react-router-dom";
import { STRINGS } from "@/constants/strings";

const employeeOptions = [
  {
    href: "/dashboard/employee/timesheet",
    label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_SUBMIT_TIMESHEET_LABEL,
    description: STRINGS.DASHBOARD.EMPLOYEE_OPTION_SUBMIT_TIMESHEET_DESC,
  },
  {
    href: "/dashboard/employee/timesheets",
    label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_TIMESHEETS_LABEL,
    description: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_TIMESHEETS_DESC,
  },
  {
    href: "/dashboard/employee/allocations",
    label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_ALLOCATIONS_LABEL,
    description: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_ALLOCATIONS_DESC,
  },
];

export default function EmployeeDashboard() {
  // Mock reminder flag for week (BRD Screen 5 shows reminder if latest timesheet is missing)
  const showReminder = true;
  const reminderWeek = "29-May-2026"; // Example date matching seeding/context timeframe

  return (
    <div>
      <div>
        <h1>{STRINGS.DASHBOARD.MY_WORKSPACE}</h1>
      </div>

      {/* V4 Timesheet Reminder Banner */}
      {showReminder && (
        <div style={{ border: "1px solid #cc8800", backgroundColor: "#fffbeb", padding: "10px", borderRadius: "4px", marginBottom: "15px" }}>
          <strong style={{ color: "#b45309" }}>{STRINGS.DASHBOARD.TIMESHEET_REMINDER}</strong>
          <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#78350f" }}>
            {STRINGS.DASHBOARD.TIMESHEET_REMINDER_PREFIX} <strong>{reminderWeek}</strong> {STRINGS.DASHBOARD.TIMESHEET_REMINDER_SUFFIX}
          </p>
        </div>
      )}

      {/* Grid of Employee Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
        {employeeOptions.map((option) => (
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

