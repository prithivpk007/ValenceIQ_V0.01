import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import {
  Menu,
  Search,
  Bell,
  Shield,
  Briefcase,
  Users,
  ChevronDown,
  LogOut,
  User,
  Settings,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export const Header = ({ onMobileNavToggle }) => {
  const { user, role, switchRole, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const roleRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
      if (roleRef.current && !roleRef.current.contains(e.target)) setShowRoleMenu(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleRoleChange = async (targetRole) => {
    await switchRole(targetRole);
    setShowRoleMenu(false);
    if (targetRole === "admin") navigate("/admin/dashboard");
    else if (targetRole === "staff") navigate("/staff/dashboard");
    else navigate("/portal/dashboard");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Route to global relevant search
    navigate(`/customers?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Nav Toggle & Search */}
      <div className="flex items-center gap-3 grow max-w-lg">
        <button
          onClick={onMobileNavToggle}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscriptions, invoices, customers..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </form>
      </div>

      {/* Right: Role Switcher & User Actions */}
      <div className="flex items-center gap-2.5">
        {/* Role Switcher Pill */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <span className="text-2xs text-slate-400 uppercase tracking-wider font-semibold">Demo Role:</span>
            <span
              className={`px-2 py-0.5 rounded text-2xs font-bold uppercase tracking-wide ${
                role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : role === "staff"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {role}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  Switch Active Persona
                </p>
              </div>

              <button
                onClick={() => handleRoleChange("admin")}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-50 cursor-pointer ${
                  role === "admin" ? "bg-purple-50 text-purple-900 font-semibold" : "text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="leading-tight">Administrator</p>
                    <p className="text-2xs text-slate-400">Full platform controls & AI</p>
                  </div>
                </div>
                {role === "admin" && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
              </button>

              <button
                onClick={() => handleRoleChange("staff")}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-50 cursor-pointer ${
                  role === "staff" ? "bg-blue-50 text-blue-900 font-semibold" : "text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="leading-tight">Staff Member</p>
                    <p className="text-2xs text-slate-400">Quotations & operations</p>
                  </div>
                </div>
                {role === "staff" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleChange("customer")}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-50 cursor-pointer ${
                  role === "customer" ? "bg-emerald-50 text-emerald-900 font-semibold" : "text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="leading-tight">Customer</p>
                    <p className="text-2xs text-slate-400">TechScale Solutions Pvt Ltd</p>
                  </div>
                </div>
                {role === "customer" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-3xs font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-40 animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Notifications</h4>
                  <p className="text-2xs text-slate-500">{unreadCount} unread alerts</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-2xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                      !n.read ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xs font-semibold text-slate-800">{n.title}</span>
                      <span className="text-3xs text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-2xs text-slate-600 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                >
                  View all notifications <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120"}
              alt={user?.name || "User"}
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-2xs text-slate-500 truncate">{user?.email}</p>
              </div>

              <Link
                to="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="w-full px-3 py-2 text-left flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                Preferences & Profile
              </Link>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate("/login");
                }}
                className="w-full px-3 py-2 text-left flex items-center gap-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-slate-100 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
