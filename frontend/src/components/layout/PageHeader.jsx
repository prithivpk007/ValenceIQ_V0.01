import React from "react";
import { Breadcrumbs } from "../common/Breadcrumbs";

export const PageHeader = ({
  title,
  description,
  action,
  breadcrumbs,
  className = "",
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <Breadcrumbs customCrumbs={breadcrumbs} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0">{title}</h1>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
};
