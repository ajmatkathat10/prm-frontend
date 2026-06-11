import * as React from "react"

interface TooltipProps {
  content: string
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span title={content} className={className}>
      {children}
    </span>
  );
}
