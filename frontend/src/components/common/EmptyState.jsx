import React from "react";
import { FolderX } from "lucide-react";
import { Button } from "./Button";

export const EmptyState = ({
  icon: Icon = FolderX,
  title = "No records found",
  description = "No items match your current filter or search criteria.",
  actionText,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`p-10 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1">{description}</p>
      {actionText && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
