import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

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

  const displayText = text || (size === 'sm' ? "..." : "Loading...");

  if (global) {
    return (
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999
      }}>
        <div style={{ padding: "10px", border: "1px solid black", background: "white", fontWeight: "bold" }}>
          Processing...
        </div>
      </div>
    );
  }

  return (
    <span className={className} style={{ fontSize: size === 'sm' ? '12px' : '14px', color: '#666' }}>
      ({displayText})
    </span>
  );
}
