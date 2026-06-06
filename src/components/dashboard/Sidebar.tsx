import { Link } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { STRINGS } from "@/constants/strings";
import type { UserRole } from "@/types/auth";

interface SidebarProps {
  user: { username: string; role: UserRole } | null;
  roleConfiguration: {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    badge: string;
  };
  sidebarNavigationItems: { href: string; label: string; icon: React.ElementType }[];
  pathname: string;
  handleLogout: () => void;
  loggingOut: boolean;
}

export function Sidebar({
  user,
  roleConfiguration,
  sidebarNavigationItems,
  pathname,
  handleLogout,
  loggingOut,
}: SidebarProps) {
  const RoleIcon = roleConfiguration.icon;

  return (
    <aside className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 items-center">
      {/* Logo Icon */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800 w-full shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
        </div>
      </div>

      {/* Role Icon / Profile avatar with Tooltip */}
      {user && (
        <div className="py-4 border-b border-slate-800 flex justify-center w-full">
          <Tooltip content={`${user.username} (${roleConfiguration.label})`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleConfiguration.bg} border ${roleConfiguration.border}`}>
              <RoleIcon className={`w-5 h-5 ${roleConfiguration.color}`} />
            </div>
          </Tooltip>
        </div>
      )}

      {/* Navigation links with Tooltips */}
      <nav className="flex-1 py-4 space-y-2 overflow-visible flex flex-col items-center w-full">
        {sidebarNavigationItems.map(({ href, label, icon: Icon }) => {
          const currentRole = user?.role ?? "EMPLOYEE";
          const isActive =
            pathname === href ||
            (href !== `/dashboard/${currentRole.toLowerCase()}` &&
              pathname.startsWith(href));
          return (
            <Tooltip key={href} content={label}>
              <Link
                to={href}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150
                  ${isActive
                    ? `${roleConfiguration.bg} ${roleConfiguration.color} border ${roleConfiguration.border}`
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-850"
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      {/* Logout with Tooltip */}
      <div className="p-3 border-t border-slate-800 shrink-0 flex justify-center w-full">
        <Tooltip content={loggingOut ? STRINGS.DASHBOARD.LOGGING_OUT : STRINGS.DASHBOARD.LOG_OUT}>
          <button
            id="logout-button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-150 disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
