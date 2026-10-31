import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useNotifications } from "../../context/NotificationContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { BrandLogo } from "../../components/common/BrandLogo";
import { Repeat, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

export const ResetPassword = () => {
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword("mock_token", password);
      showToast("Password updated successfully! Please sign in.", "success");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <BrandLogo
            size="lg"
            variant="stacked"
            theme="light"
            showTagline={false}
          />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight text-center mt-3">Set New Password</h2>
          <p className="text-xs text-slate-500 text-center mt-0.5">Choose a secure password for your ValenceIQ account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              icon={Lock}
              required
            />
            <Input
              label="Confirm New Password"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              icon={Lock}
              required
            />

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Update Password
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="text-xs text-slate-600 hover:text-blue-700 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
