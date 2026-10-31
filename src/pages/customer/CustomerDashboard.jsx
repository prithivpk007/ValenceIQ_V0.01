import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatCard, Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { subscriptionService } from "../../services/subscriptionService";
import { invoiceService } from "../../services/invoiceService";
import { paymentService } from "../../services/paymentService";
import {
  Repeat,
  Receipt,
  CreditCard,
  Calendar,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building,
} from "lucide-react";

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const customerId = user?.customerId || "cust_1";

  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        const [subRes, invRes, payRes] = await Promise.all([
          subscriptionService.getAll({ customerId }),
          invoiceService.getAll({ customerId }),
          paymentService.getAll({ customerId }),
        ]);
        setSubscriptions(subRes.data);
        setInvoices(invRes.data);
        setPayments(payRes.data);
      } catch (err) {
        console.error("Error loading customer data:", err);
      }
    };
    loadCustomerData();
  }, [customerId]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  const activeSub = subscriptions.find((s) => s.status === "Active") || subscriptions[0];
  const pendingInvoices = invoices.filter((i) => i.balanceDue > 0);
  const totalBalanceDue = pendingInvoices.reduce((acc, i) => acc + Number(i.balanceDue), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Subscriber Portal — ${user?.companyName || "TechScale Solutions"}`}
        description="Manage your enterprise subscriptions, review recurring invoices, and track payment receipts."
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Enterprise SLA Active
            </span>
          </div>
        }
      />

      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Subscriptions"
          value={subscriptions.filter((s) => s.status === "Active").length}
          subtitle={activeSub ? activeSub.planName : "No active plan"}
          icon={Repeat}
        />
        <StatCard
          title="Current Plan Value"
          value={formatCurrency(activeSub?.subscriptionValue)}
          subtitle={activeSub ? `Billed ${activeSub.billingInterval}` : "N/A"}
          icon={CreditCard}
        />
        <StatCard
          title="Next Scheduled Billing"
          value={activeSub?.nextBillingDate || "15 Nov 2024"}
          subtitle="Auto-renewal enabled"
          icon={Calendar}
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(totalBalanceDue)}
          subtitle={totalBalanceDue > 0 ? "Due for payment" : "Account fully paid"}
          trendType={totalBalanceDue > 0 ? "down" : "up"}
          icon={Receipt}
        />
      </div>

      {/* Main Subscriptions Banner */}
      {activeSub && (
        <Card className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 border-none shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-2xs font-semibold uppercase tracking-wider border border-blue-400/30">
                  Primary Package
                </span>
                <span className="text-2xs text-slate-400 font-mono">{activeSub.subscriptionNumber}</span>
              </div>
              <h2 className="text-xl font-bold text-white m-0">{activeSub.planName}</h2>
              <p className="text-xs text-slate-300 mt-1">
                Contract Validity: {activeSub.startDate} to {activeSub.expiryDate} • Payment terms: {activeSub.paymentTerms}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xs uppercase text-slate-400 font-medium">Monthly License</p>
                <p className="text-2xl font-extrabold text-white">{formatCurrency(activeSub.subscriptionValue)}</p>
              </div>
              <Link to="/portal/subscriptions">
                <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500">
                  Manage Plan
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Two Column Invoices and Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card>
          <CardHeader
            title="My Recent Invoices"
            subtitle="Generated recurring invoices for your company"
            action={
              <Link to="/portal/invoices" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                All Invoices <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          <div className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-500">No invoices generated yet.</p>
            ) : (
              invoices.slice(0, 4).map((inv) => (
                <div key={inv.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{inv.invoiceNumber}</span>
                      <Badge status={inv.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{inv.billingPeriod}</p>
                    <p className="text-2xs text-slate-400">Due on {inv.dueDate}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-slate-900">{formatCurrency(inv.total)}</p>
                    {inv.balanceDue > 0 ? (
                      <Link to="/portal/invoices">
                        <span className="text-2xs font-bold text-blue-600 hover:underline">Pay Now</span>
                      </Link>
                    ) : (
                      <span className="text-2xs text-emerald-600 font-medium">Settled</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader
            title="Payment Receipts & History"
            subtitle="Confirmed electronic payments and bank reconciliations"
            action={
              <Link to="/portal/payments" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                Full History <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          <div className="divide-y divide-slate-100">
            {payments.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-500">No payment records found.</p>
            ) : (
              payments.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{p.paymentNumber}</span>
                      <Badge status={p.status} />
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{p.paymentMethod} • Ref: {p.reference}</p>
                    <p className="text-2xs text-slate-400">{p.paymentDate}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-emerald-700">{formatCurrency(p.amount)}</p>
                    <span className="text-2xs text-slate-400">Invoice: {p.invoiceNumber}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
