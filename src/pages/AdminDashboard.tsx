import {
  Users,
  FolderKanban,
  Briefcase,
  UserCheck,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { STRINGS } from "@/constants/strings";

const adminOptions = [
  {
    href: "/dashboard/admin/resources",
    label: STRINGS.DASHBOARD.ADMIN_OPTION_EMPLOYEES_LABEL,
    description: STRINGS.DASHBOARD.ADMIN_OPTION_EMPLOYEES_DESC,
    icon: Users,
    color: "text-indigo-455",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
  {
    href: "/dashboard/admin/projects",
    label: STRINGS.DASHBOARD.ADMIN_OPTION_PROJECTS_LABEL,
    description: STRINGS.DASHBOARD.ADMIN_OPTION_PROJECTS_DESC,
    icon: FolderKanban,
    color: "text-amber-455",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
  {
    href: "/dashboard/admin/allocations",
    label: STRINGS.DASHBOARD.ADMIN_OPTION_ALLOCATIONS_LABEL,
    description: STRINGS.DASHBOARD.ADMIN_OPTION_ALLOCATIONS_DESC,
    icon: Briefcase,
    color: "text-emerald-455",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
  {
    href: "/dashboard/admin/users",
    label: STRINGS.DASHBOARD.ADMIN_OPTION_USERS_LABEL,
    description: STRINGS.DASHBOARD.ADMIN_OPTION_USERS_DESC,
    icon: UserCheck,
    color: "text-rose-455",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
  {
    href: "/dashboard/admin/settings",
    label: STRINGS.DASHBOARD.ADMIN_OPTION_SETTINGS_LABEL,
    description: STRINGS.DASHBOARD.ADMIN_OPTION_SETTINGS_DESC,
    icon: Settings,
    color: "text-slate-455",
    bg: "bg-slate-800/40",
    border: "border-slate-800",
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">{STRINGS.DASHBOARD.SYSTEM_CONTROL}</h1>
      </div>

      {/* Grid of Admin Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminOptions.map((option) => {
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
