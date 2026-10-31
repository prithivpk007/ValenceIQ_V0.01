import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  FileText,
  Repeat,
  Receipt,
  CreditCard,
  Percent,
  UserCheck,
  BarChart3,
  Sparkles,
  Bell,
  Settings,
  Shield,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { role, user, logout } = useAuth();

  // Role-specific navigation items per requirements
  const adminNav = [
    { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/products", icon: Package },
    { label: "Plans", path: "/plans", icon: Layers },
    { label: "Customers", path: "/customers", icon: Users },
    { label: "Quotations", path: "/quotations", icon: FileText },
    { label: "Subscriptions", path: "/subscriptions", icon: Repeat },
    { label: "Invoices", path: "/invoices", icon: Receipt },
    { label: "Payments", path: "/payments", icon: CreditCard },
    { label: "Discounts", path: "/discounts", icon: Percent },
    { label: "Staff Management", path: "/staff", icon: UserCheck },
    { label: "Analytics & Reports", path: "/analytics", icon: BarChart3 },
    { label: "AI Insights", path: "/ai-insights", icon: Sparkles, badge: "AI" },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const staffNav = [
    { label: "Overview", path: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Customers", path: "/customers", icon: Users },
    { label: "Quotations", path: "/quotations", icon: FileText },
    { label: "Subscriptions", path: "/subscriptions", icon: Repeat },
    { label: "Invoices", path: "/invoices", icon: Receipt },
    { label: "Payments", path: "/payments", icon: CreditCard },
    { label: "Operational Reports", path: "/staff/reports", icon: BarChart3 },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Profile", path: "/settings", icon: Settings },
  ];

  const customerNav = [
    { label: "My Dashboard", path: "/portal/dashboard", icon: LayoutDashboard },
    { label: "My Subscriptions", path: "/portal/subscriptions", icon: Repeat },
    { label: "My Invoices", path: "/portal/invoices", icon: Receipt },
    { label: "Payment History", path: "/portal/payments", icon: CreditCard },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "My Profile", path: "/settings", icon: Settings },
  ];

  const currentNav = role === "admin" ? adminNav : role === "staff" ? staffNav : customerNav;

  const roleLabels = {
    admin: { label: "Administrator", color: "bg-purple-100 text-purple-700 border-purple-200" },
    staff: { label: "Staff Portal", color: "bg-blue-100 text-blue-700 border-blue-200" },
    customer: { label: "Customer Portal", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Repeat className="w-5 h-5 animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                Brightloop <span className="text-blue-400 font-semibold text-xs">SaaS</span>
              </h1>
              <p className="text-2xs text-slate-400 truncate">Subscription Cloud</p>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Indicator Banner */}
      {!isCollapsed && (
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {role === "admin" ? (
              <Shield className="w-3.5 h-3.5 text-purple-400" />
            ) : role === "staff" ? (
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Users className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="text-2xs uppercase tracking-wider font-semibold text-slate-400">
              {roleLabels[role]?.label || "Portal"}
            </span>
          </div>
          <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            Phase 1
          </span>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {currentNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                } ${isCollapsed ? "justify-center px-2" : ""}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-3xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/40">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120"}
            alt={user?.name || "User"}
            className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0"
          />
          {!isCollapsed && (
            <div className="grow min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name || "Alex Sterling"}</p>
              <p className="text-2xs text-slate-400 truncate">{user?.email || "admin@brightloop.io"}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 z-30 shrink-0 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
