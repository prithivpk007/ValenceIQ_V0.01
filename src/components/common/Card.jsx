import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export const Card = ({ children, className = "", onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/90 shadow-xs transition-shadow hover:shadow-sm ${
        onClick ? "cursor-pointer hover:border-slate-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = "" }) => {
  return (
    <div className={`p-5 pb-3 border-b border-slate-100 flex items-center justify-between gap-4 ${className}`}>
      <div>
        <h3 className="font-semibold text-slate-900 text-base leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const StatCard = ({
  title,
  value,
  subtitle,
  trend,
  trendType = "neutral", // 'up' | 'down' | 'neutral'
  icon: Icon,
  badgeText,
  className = "",
}) => {
  return (
    <Card className={`p-5 relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h4>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {trend && (
          <span
            className={`inline-flex items-center font-medium ${
              trendType === "up"
                ? "text-emerald-600"
                : trendType === "down"
                ? "text-rose-600"
                : "text-slate-600"
            }`}
          >
            {trendType === "up" ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : trendType === "down" ? (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            ) : null}
            {trend}
          </span>
        )}
        {subtitle && <span className="text-slate-500">{subtitle}</span>}
        {badgeText && (
          <span className="ml-auto px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-2xs font-semibold">
            {badgeText}
          </span>
        )}
      </div>
    </Card>
  );
};
