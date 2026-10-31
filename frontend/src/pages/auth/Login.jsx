import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import {
  Repeat,
  Shield,
  Briefcase,
  Users,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Mail,
} from "lucide-react";

export const Login = () => {
  const { login } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@brightloop.io");
  const [password, setPassword] = useState("Brightloop2024!");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, "success");
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "staff") navigate("/staff/dashboard");
      else navigate("/portal/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
      showToast(err.message || "Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-3">
            <Repeat className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Brightloop Software</h1>
          <p className="text-xs text-slate-500 mt-1">Enterprise Subscription Management Cloud</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a demo role below or enter your credentials.
            </p>
          </div>

          {/* Quick Demo Selector */}
          <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <p className="text-2xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Instant Demo Access:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect("admin@brightloop.io", "Brightloop2024!")}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  email === "admin@brightloop.io"
                    ? "border-purple-600 bg-purple-50 text-purple-900 font-semibold"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Shield className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                <span className="text-2xs block">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect("priya@brightloop.io", "Brightloop2024!")}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  email === "priya@brightloop.io"
                    ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Briefcase className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                <span className="text-2xs block">Staff</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect("rajesh@techscale.in", "Brightloop2024!")}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  email === "rajesh@techscale.in"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Users className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span className="text-2xs block">Customer</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              icon={Mail}
              required
            />

            <div className="w-full space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Password <span className="text-rose-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-2xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                Register company
              </Link>
            </p>
          </div>
        </div>

        {/* Phase 1 Notice */}
        <div className="mt-6 text-center text-2xs text-slate-400">
          <p>Brightloop Subscription Management System • Phase 1 Prototype</p>
          <p className="mt-0.5">Frontend Mock Mode Active • Ready for Phase 2 API Integration</p>
        </div>
      </div>
    </div>
  );
};
