import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotifications();

  if (!toasts.length) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200 bg-emerald-50/90 text-emerald-900",
    error: "border-rose-200 bg-rose-50/90 text-rose-900",
    warning: "border-amber-200 bg-amber-50/90 text-amber-900",
    info: "border-blue-200 bg-blue-50/90 text-blue-900",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start gap-3 backdrop-blur-xs transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            borders[toast.type] || borders.info
          }`}
        >
          {icons[toast.type] || icons.info}
          <div className="text-xs font-medium grow leading-relaxed">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-black/5 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
