import type { UserRole } from "@/types/auth";

interface HeaderProps {
  user: { username: string; role: UserRole } | null;
  roleConfiguration: {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    badge: string;
  };
}

export function Header({ user, roleConfiguration }: HeaderProps) {
  const RoleIcon = roleConfiguration.icon;

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 gap-4 shrink-0 top-0 z-20">
      {/* Page Title */}
      <div className="flex-1 font-semibold text-slate-200 text-sm tracking-wide">
        PRM - {user?.role === "ADMIN" ? "Admin" : user?.role === "MANAGER" ? "Manager" : "Employee"}
      </div>

      {/* User Chip */}
      {user && (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${roleConfiguration.badge}`}>
          <RoleIcon className="w-3.5 h-3.5" />
          <span>{user.username}</span>
          <span className="opacity-60">·</span>
          <span>{roleConfiguration.label}</span>
        </div>
      )}
    </header>
  );
}
