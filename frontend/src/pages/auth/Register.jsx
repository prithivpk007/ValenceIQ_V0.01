import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { Input, Select } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { BrandLogo } from "../../components/common/BrandLogo";
import { Repeat, Mail, Lock, User, Building, Phone } from "lucide-react";

export const Register = () => {
  const { register } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      showToast("Registration successful! Welcome to ValenceIQ.", "success");
      navigate("/portal/dashboard");
    } catch (err) {
      setError(err.message || "Failed to register.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="mb-6">
          <BrandLogo
            size="lg"
            variant="stacked"
            theme="light"
            showTagline={true}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rajesh Verma"
                icon={User}
                required
              />
              <Input
                label="Company Name"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="TechScale Pvt Ltd"
                icon={Building}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Work Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rajesh@techscale.in"
                icon={Mail}
                required
              />
              <Input
                label="Phone Number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 99887 76655"
                icon={Phone}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                icon={Lock}
                required
              />
              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                icon={Lock}
                required
              />
            </div>

            <Select
              label="Account Persona / Tier"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: "customer", label: "Customer Self-Service (Client Portal)" },
                { value: "staff", label: "Internal Staff (Account Executive / Billing)" },
              ]}
            />

            {/* Password Policy Helper */}
            <div className="p-3 bg-slate-50 rounded-lg text-2xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Security Requirements:</p>
              <p>• Minimum 8 characters in length</p>
              <p>• Stored safely in local mock store during Phase 1 prototype</p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
