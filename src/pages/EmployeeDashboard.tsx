import {
  Clock,
  Briefcase,
  History,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { STRINGS } from "@/constants/strings";

const employeeOptions = [
  {
    href: "/dashboard/employee/timesheet",
    label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_SUBMIT_TIMESHEET_LABEL,
    description: STRINGS.DASHBOARD.EMPLOYEE_OPTION_SUBMIT_TIMESHEET_DESC,
    icon: Clock,
    color: "text-slate-300",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
  {
    href: "/dashboard/employee/timesheets",
    label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_TIMESHEETS_LABEL,
    description: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_TIMESHEETS_DESC,
    icon: History,
    color: "text-slate-300",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
  {
    href: "/dashboard/employee/allocations",
    label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_ALLOCATIONS_LABEL,
    description: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_ALLOCATIONS_DESC,
    icon: Briefcase,
    color: "text-slate-300",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
];

export default function EmployeeDashboard() {
  // Mock reminder flag for week (BRD Screen 5 shows reminder if latest timesheet is missing)
  const showReminder = true;
  const reminderWeek = "29-May-2026"; // Example date matching seeding/context timeframe

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">{STRINGS.DASHBOARD.MY_WORKSPACE}</h1>
      </div>

      {/* V4 Timesheet Reminder Banner */}
      {showReminder && (
        <div className="flex items-start gap-4 p-4 bg-slate-900 border border-amber-500/20 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-amber-400">{STRINGS.DASHBOARD.TIMESHEET_REMINDER}</h2>
            <p className="text-xs text-slate-300 mt-1">
              {STRINGS.DASHBOARD.TIMESHEET_REMINDER_PREFIX} <strong>{reminderWeek}</strong> {STRINGS.DASHBOARD.TIMESHEET_REMINDER_SUFFIX}
            </p>
          </div>
        </div>
      )}

      {/* Grid of Employee Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employeeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div key={option.label}>
              <Link
                to={option.href}
                className={`group block h-full rounded-2xl border ${option.border} ${option.bg} p-6 hover:bg-slate-850 hover:border-slate-700 transition-all duration-150`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-slate-300" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 group-hover:text-slate-50 transition-colors">
                    {option.label}
                  </h2>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {option.description}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
