import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatCard, Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { customerService } from "../../services/customerService";
import { quotationService } from "../../services/quotationService";
import { invoiceService } from "../../services/invoiceService";
import { paymentService } from "../../services/paymentService";
import {
  Users,
  FileText,
  AlertCircle,
  CreditCard,
  PlusCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [assignedCustomers, setAssignedCustomers] = useState([]);
  const [pendingQuotations, setPendingQuotations] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const [custRes, quoRes, invRes, payRes] = await Promise.all([
          customerService.getAll({ search: "" }),
          quotationService.getAll({ status: "Quotation" }),
          invoiceService.getAll({ status: "Overdue" }),
          paymentService.getAll(),
        ]);

        // Filter customers assigned to Priya Sharma or staff member
        const staffName = user?.name || "Priya Sharma";
        const assigned = custRes.data.filter((c) => c.assignedStaff === staffName || !c.assignedStaff);
        setAssignedCustomers(assigned);
        setPendingQuotations(quoRes.data);
        setPendingInvoices(invRes.data);
        setRecentPayments(payRes.data.slice(0, 5));
      } catch (err) {
        console.error("Error loading staff data:", err);
      }
    };
    loadStaffData();
  }, [user]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name || "Priya"}`}
        description="Operational overview of your client accounts, quotations in review, and collections."
        action={
          <div className="flex items-center gap-2">
            <Link to="/quotations">
              <Button variant="primary" size="sm" icon={PlusCircle}>
                New Quotation
              </Button>
            </Link>
          </div>
        }
      />

      {/* Staff Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Accounts"
          value={assignedCustomers.length || 3}
          subtitle="Primary client portfolio"
          icon={Users}
        />
        <StatCard
          title="Quotations in Review"
          value={pendingQuotations.length}
          subtitle="Awaiting client sign-off"
          trend="Follow-up needed"
          trendType="down"
          icon={FileText}
        />
        <StatCard
          title="Follow-Up Invoices"
          value={pendingInvoices.length}
          subtitle="Overdue or partial"
          trend="Overdue alert"
          trendType="down"
          icon={AlertCircle}
        />
        <StatCard
          title="Recent Collections"
          value={formatCurrency(
            recentPayments.reduce((acc, p) => acc + (p.status === "Successful" ? p.amount : 0), 0)
          )}
          subtitle="Verified payments"
          trendType="up"
          icon={CreditCard}
        />
      </div>

      {/* Operational Task Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Quotations Requiring Follow-Up */}
        <Card>
          <CardHeader
            title="Quotations Requiring Client Follow-up"
            subtitle="Sent agreements awaiting electronic signature"
            action={
              <Link to="/quotations" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          <div className="divide-y divide-slate-100">
            {pendingQuotations.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-500">No pending quotations awaiting sign-off.</p>
            ) : (
              pendingQuotations.map((quo) => (
                <div key={quo.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{quo.quotationNumber}</span>
                      <Badge status={quo.status} />
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">{quo.customerName}</p>
                    <p className="text-2xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-500" /> Valid until: {quo.validityDate}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-slate-900">{formatCurrency(quo.finalTotal)}</p>
                    <Link to="/quotations">
                      <span className="text-2xs text-blue-600 hover:underline">Review & Resend</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Assigned Customers Quick List */}
        <Card>
          <CardHeader
            title="My Assigned Customer Accounts"
            subtitle="Accounts under your direct management"
            action={
              <Link to="/customers" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                Directory <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          <div className="divide-y divide-slate-100">
            {assignedCustomers.slice(0, 4).map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 truncate">{c.name}</span>
                    <Badge status={c.status} />
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">Contact: {c.contactPerson} ({c.phone})</p>
                  <p className="text-2xs text-slate-400 mt-0.5">{c.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {c.activeSubscriptionsCount} Subscriptions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Payments Received */}
      <Card>
        <CardHeader
          title="Recent Payment Activity"
          subtitle="Real-time collection feed across all clients"
          action={
            <Link to="/payments" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              All Payments <ArrowRight className="w-3 h-3" />
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3.5 pl-5">Payment Ref</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5 pr-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-5 font-medium text-slate-900">{p.paymentNumber}</td>
                  <td className="p-3.5 font-medium">{p.customerName}</td>
                  <td className="p-3.5">{p.paymentMethod}</td>
                  <td className="p-3.5 text-slate-500">{p.paymentDate}</td>
                  <td className="p-3.5 font-bold text-slate-900">{formatCurrency(p.amount)}</td>
                  <td className="p-3.5 pr-5">
                    <Badge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
