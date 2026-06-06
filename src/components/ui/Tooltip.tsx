import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  content: string
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <div className={cn("group relative flex items-center justify-center", className)}>
      {children}
      <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-slate-100 text-xs font-medium rounded-md border border-slate-700 shadow-xl opacity-0 scale-95 origin-left pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 whitespace-nowrap z-50">
        {content}
      </div>
    </div>
  );
}
