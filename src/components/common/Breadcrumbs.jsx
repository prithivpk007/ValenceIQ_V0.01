import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs = ({ customCrumbs }) => {
  const location = useLocation();

  if (customCrumbs) {
    return (
      <nav className="flex items-center space-x-1.5 text-xs text-slate-500 mb-4">
        <Link to="/" className="text-slate-400 hover:text-slate-600 flex items-center">
          <Home className="w-3.5 h-3.5" />
        </Link>
        {customCrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            {crumb.path ? (
              <Link to={crumb.path} className="hover:text-blue-700 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-800">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 mb-4">
      <Link to="/" className="text-slate-400 hover:text-slate-600 flex items-center">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const formatted = name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800">{formatted}</span>
            ) : (
              <Link to={routeTo} className="hover:text-blue-700 transition-colors capitalize">
                {formatted}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
