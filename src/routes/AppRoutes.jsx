import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppShell } from "../components/layout/AppShell";

// Auth Pages
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";

// Dashboard Pages
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { StaffDashboard } from "../pages/staff/StaffDashboard";
import { OperationalReports } from "../pages/staff/OperationalReports";
import { CustomerDashboard } from "../pages/customer/CustomerDashboard";
import { CustomerSubscriptions } from "../pages/customer/CustomerSubscriptions";
import { CustomerInvoices } from "../pages/customer/CustomerInvoices";
import { CustomerPayments } from "../pages/customer/CustomerPayments";

// Module Pages
import { ProductsPage } from "../pages/products/ProductsPage";
import { PlansPage } from "../pages/plans/PlansPage";
import { CustomersPage } from "../pages/customers/CustomersPage";
import { CustomerDetailPage } from "../pages/customers/CustomerDetailPage";
import { QuotationsPage } from "../pages/quotations/QuotationsPage";
import { SubscriptionsPage } from "../pages/subscriptions/SubscriptionsPage";
import { InvoicesPage } from "../pages/invoices/InvoicesPage";
import { PaymentsPage } from "../pages/payments/PaymentsPage";
import { DiscountsPage } from "../pages/discounts/DiscountsPage";
import { StaffManagementPage } from "../pages/staff/StaffManagementPage";
import { AnalyticsPage } from "../pages/analytics/AnalyticsPage";
import { AiInsightsPage } from "../pages/ai/AiInsightsPage";
import { NotificationsPage } from "../pages/notifications/NotificationsPage";
import { SettingsPage } from "../pages/settings/SettingsPage";

// Role-based root redirect helper
const RootRedirect = () => {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "staff") return <Navigate to="/staff/dashboard" replace />;
  return <Navigate to="/portal/dashboard" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Main Authenticated App Shell */}
      <Route element={<AppShell />}>
        <Route path="/" element={<RootRedirect />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Staff Routes */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/reports" element={<OperationalReports />} />

        {/* Customer Portal Routes */}
        <Route path="/portal/dashboard" element={<CustomerDashboard />} />
        <Route path="/portal/subscriptions" element={<CustomerSubscriptions />} />
        <Route path="/portal/invoices" element={<CustomerInvoices />} />
        <Route path="/portal/payments" element={<CustomerPayments />} />

        {/* Business Modules (Role-aware) */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/quotations" element={<QuotationsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/discounts" element={<DiscountsPage />} />
        <Route path="/staff" element={<StaffManagementPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ai-insights" element={<AiInsightsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};
