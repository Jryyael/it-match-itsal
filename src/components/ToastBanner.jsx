import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ToastBanner() {
  const { toast, setToast } = useApp();
  if (!toast) return null;

  const styles = {
    success: 'border-[#009FE3] bg-[#0D2240] text-white',
    error: 'border-rose-500 bg-rose-950 text-white',
    info: 'border-[#D99B16] bg-[#0D2240] text-white',
  };

  const Icon =
    toast.type === 'error'
      ? AlertCircle
      : toast.type === 'info'
      ? Info
      : CheckCircle2;

  return (
    <div className="no-print fixed top-20 right-5 z-50 max-w-sm animate-it-enter">
      <div
        className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl ${
          styles[toast.type] || styles.success
        }`}
      >
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#009FE3]" />
        <div className="flex-1 text-xs">
          <p className="font-bold">{toast.message}</p>
          {toast.detail && (
            <p className="mt-0.5 text-slate-300">{toast.detail}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setToast(null)}
          className="rounded-full p-0.5 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
