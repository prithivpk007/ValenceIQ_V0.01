import React from "react";

export const Badge = ({ children, status, variant, className = "" }) => {
  // If status prop is supplied, derive semantic badge style
  const getStyleByStatus = (st) => {
    switch (st?.toLowerCase()) {
      case "active":
      case "paid":
      case "confirmed":
      case "successful":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "paused":
      case "partially paid":
      case "pending":
      case "quotation":
      case "on leave":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "overdue":
      case "expired":
      case "closed":
      case "cancelled":
      case "suspended":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "draft":
      case "inactive":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const style = variant || (status ? getStyleByStatus(status) : "bg-slate-100 text-slate-700 border-slate-200");

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5"></span>
      {children || status}
    </span>
  );
};
