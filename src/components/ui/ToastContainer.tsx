import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { removeToast } from '@/store/toastSlice';
import type { ToastMessage } from '@/store/toastSlice';
import { X } from 'lucide-react';

export default function ToastContainer() {
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dispatch]);

  const borders = {
    success: 'border-l-4 border-l-slate-800',
    error: 'border-l-4 border-l-slate-800',
    warning: 'border-l-4 border-l-slate-800',
    info: 'border-l-4 border-l-slate-800',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-3 bg-white text-slate-100 rounded border border-slate-200 shadow shadow-slate-200 animate-slide-in ${borders[toast.type]}`}
    >
      <div className="text-xs font-semibold leading-relaxed">{toast.message}</div>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
