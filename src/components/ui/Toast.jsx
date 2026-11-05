import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toasts, removeToast } = useStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all transform animate-in slide-in-from-right-5 ${
            toast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border border-rose-800'
              : toast.type === 'info'
              ? 'bg-slate-900 text-slate-100 border border-slate-800'
              : 'bg-emerald-950 text-emerald-100 border border-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-sky-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <p className="leading-tight">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

