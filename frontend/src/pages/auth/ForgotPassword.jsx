import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Repeat, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg mb-3">
            <Repeat className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password</h1>
          <p className="text-xs text-slate-500 mt-1">Reset your Brightloop account access</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Check your inbox</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We've dispatched a mock password reset link to{" "}
                <span className="font-semibold text-slate-800">{email}</span>.
              </p>
              <div className="pt-4">
                <Link to="/reset-password?token=mock_demo_token">
                  <Button variant="outline" size="sm" className="w-full">
                    Proceed to Reset Screen (Demo Shortcut)
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                Enter your registered work email and we will issue a secure recovery link.
              </p>
              <Input
                label="Registered Email"
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                icon={Mail}
                required
              />
              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                Send Recovery Instructions
              </Button>
            </form>
          )}

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
