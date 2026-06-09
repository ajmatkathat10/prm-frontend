import {
  FolderKanban,
  Users,
  Briefcase,
  Clock,
  Cpu,
} from "lucide-react";
import { Link } from "react-router-dom";
import { STRINGS } from "@/constants/strings";

const managerOptions = [
  {
    href: "/dashboard/manager/resources",
    label: STRINGS.DASHBOARD.MANAGER_OPTION_RESOURCES_LABEL,
    description: STRINGS.DASHBOARD.MANAGER_OPTION_RESOURCES_DESC,
    icon: Users,
    color: "text-slate-300",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
  {
    href: "/dashboard/manager/allocate",
    label: STRINGS.DASHBOARD.MANAGER_OPTION_ALLOCATE_LABEL,
    description: STRINGS.DASHBOARD.MANAGER_OPTION_ALLOCATE_DESC,
    icon: Briefcase,
    color: "text-slate-300",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
  {
    href: "/dashboard/manager/projects",
    label: STRINGS.DASHBOARD.MANAGER_OPTION_PROJECTS_LABEL,
    description: STRINGS.DASHBOARD.MANAGER_OPTION_PROJECTS_DESC,
    icon: FolderKanban,
    color: "text-slate-300",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
  {
    href: "/dashboard/manager/timesheets",
    label: STRINGS.DASHBOARD.MANAGER_OPTION_TIMESHEETS_LABEL,
    description: STRINGS.DASHBOARD.MANAGER_OPTION_TIMESHEETS_DESC,
    icon: Clock,
    color: "text-slate-300",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
  {
    href: "/dashboard/manager/ai",
    label: STRINGS.DASHBOARD.MANAGER_OPTION_AI_LABEL,
    description: STRINGS.DASHBOARD.MANAGER_OPTION_AI_DESC,
    icon: Cpu,
    color: "text-slate-300",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
];

export default function ManagerDashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">{STRINGS.DASHBOARD.PROJECTS_OVERVIEW}</h1>
      </div>

      {/* Grid of Manager Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managerOptions.map((option) => {
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
