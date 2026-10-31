import React from "react";

/**
 * ValenceIQ Brand Logo & Identity Component
 * Official Branding: ValenceIQ FINANCIAL ANALYST
 * Tagline: Analyze. Monitor. Optimize.
 */
export const ValenceIQSvgIcon = ({ className = "w-9 h-9", theme = "dark" }) => {
  // On dark backgrounds, use #60A5FA for the left wing so it contrasts cleanly against dark slate/navy.
  // On light backgrounds, use the primary navy #101D35 for strong brand contrast.
  const leftWingFill = theme === "dark" ? "#60A5FA" : "#101D35";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 transition-transform duration-200`}
      aria-label="ValenceIQ Logo"
    >
      {/* Left Wing of the 'V' Monogram */}
      <path
        d="M8 12L20.5 37.5C21.1 38.8 22.9 38.8 23.5 37.5L27 30L16 12H8Z"
        fill={leftWingFill}
      />

      {/* Ascending Financial Growth Data Bars */}
      {/* Bar 1 (Baseline Analytics) */}
      <rect x="15" y="25" width="4.5" height="11" rx="2" fill="#1D4ED8" />

      {/* Bar 2 (Performance Acceleration) */}
      <rect x="22.5" y="18" width="4.5" height="18" rx="2" fill="#2563EB" />

      {/* Bar 3 (Financial Optimization) */}
      <rect x="30" y="11" width="4.5" height="25" rx="2" fill="#3B82F6" />

      {/* Dynamic Ascending Trajectory & Right Wing */}
      <path
        d="M19 38L37.5 9.5C38 8.7 39 8.5 39.8 9L41.2 9.9C42 10.4 42.2 11.4 41.7 12.2L24.5 39.2C23.8 40.2 22.2 40.3 21.3 39.5L19 38Z"
        fill="#2563EB"
      />

      {/* Intelligence Diamond ('IQ' Predictive Node) */}
      <path
        d="M39.5 3L44.5 8L39.5 13L34.5 8L39.5 3Z"
        fill="#38BDF8"
      />
      <circle cx="39.5" cy="8" r="1.75" fill="#FFFFFF" />
    </svg>
  );
};

export const BrandLogo = ({
  size = "md",
  variant = "full", // "full" | "icon" | "stacked"
  theme = "dark",   // "dark" | "light"
  isCollapsed = false,
  className = "",
  showTagline = false,
}) => {
  const sizeMap = {
    sm: { icon: "w-7 h-7", title: "text-xs", sub: "text-[9px]" },
    md: { icon: "w-9 h-9", title: "text-sm", sub: "text-[10px]" },
    lg: { icon: "w-11 h-11", title: "text-lg", sub: "text-xs" },
    xl: { icon: "w-14 h-14", title: "text-2xl", sub: "text-xs" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isDark = theme === "dark";

  if (variant === "icon" || isCollapsed) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        title="ValenceIQ — Financial Analyst"
      >
        <ValenceIQSvgIcon className={currentSize.icon} theme={theme} />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="p-2.5 rounded-2xl bg-slate-900 shadow-xl shadow-blue-900/20 mb-3 border border-slate-800">
          <ValenceIQSvgIcon className={currentSize.icon} theme="dark" />
        </div>
        <div>
          <h1
            className={`font-black tracking-tight flex items-center justify-center gap-0.5 ${
              isDark ? "text-white" : "text-slate-900"
            } ${currentSize.title}`}
          >
            <span>Valence</span>
            <span className="text-blue-500">IQ</span>
          </h1>
          <p
            className={`font-bold tracking-wider uppercase mt-0.5 ${
              isDark ? "text-blue-400" : "text-blue-600"
            } ${currentSize.sub}`}
          >
            FINANCIAL ANALYST
          </p>
          {showTagline && (
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Analyze. Monitor. Optimize.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default "full" horizontal layout
  return (
    <div className={`flex items-center gap-3 overflow-hidden ${className}`}>
      <div className="shrink-0 flex items-center justify-center">
        <ValenceIQSvgIcon className={currentSize.icon} theme={theme} />
      </div>
      <div className="truncate min-w-0">
        <h1
          className={`font-bold tracking-tight leading-tight flex items-center gap-0.5 ${
            isDark ? "text-white" : "text-slate-900"
          } ${currentSize.title}`}
        >
          <span>Valence</span>
          <span className="text-blue-400 font-extrabold">IQ</span>
        </h1>
        <p
          className={`font-bold tracking-wider uppercase truncate leading-none mt-0.5 ${
            isDark ? "text-blue-400/95" : "text-blue-600"
          } ${currentSize.sub}`}
        >
          FINANCIAL ANALYST
        </p>
        {showTagline && (
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            Analyze. Monitor. Optimize.
          </p>
        )}
      </div>
    </div>
  );
};

