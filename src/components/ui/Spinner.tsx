import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { STRINGS } from '@/constants/strings';

interface SpinnerProps {
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
  global?: boolean;
}

export function Spinner({ text, size = 'md', className = '', global = false }: SpinnerProps) {
  const isPending = useSelector((state: RootState) => {
    if (!global) return false;
    return state.spinner.isVisible;
  });

  if (global && !isPending) return null;

  const isSm = size === 'sm';
  const displaySpinner = (
    <svg className={`animate-spin text-slate-500 ${isSm ? 'h-4 w-4' : 'h-8 w-8'}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  // Default to full-page style if size is "md" and no custom text is supplied
  const displayText = text === undefined && size === 'md' ? STRINGS.COMMON.LOADING : text;

  if (global) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/45 backdrop-blur-[1px] pointer-events-auto select-none">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl flex items-center gap-3">
          <svg className="animate-spin text-slate-500 h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-slate-200 text-xs font-semibold uppercase tracking-wider">
            Processing...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isSm ? '' : 'flex-col'} ${className}`}>
      {displaySpinner}
      {displayText && <span className="text-slate-400 text-sm">{displayText}</span>}
    </div>
  );
}
