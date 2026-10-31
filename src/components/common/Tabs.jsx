import React from "react";

export const Tabs = ({ tabs = [], activeTab, onChange, className = "" }) => {
  return (
    <div className={`border-b border-slate-200 flex items-center gap-1 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-xs whitespace-nowrap transition-colors cursor-pointer select-none ${
              isActive
                ? "border-blue-700 text-blue-700 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 ${isActive ? "text-blue-700" : "text-slate-400"}`} />}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-2xs ${
                  isActive ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
