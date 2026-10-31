import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatCard, Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { analyticsService } from "../../services/analyticsService";
import { invoiceService } from "../../services/invoiceService";
import { subscriptionService } from "../../services/subscriptionService";
import { customerService } from "../../services/customerService";
import {
  Users,
  Repeat,
  TrendingUp,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [mrrTrend, setMrrTrend] = useState([]);
  const [revenueByPlan, setRevenueByPlan] = useState([]);
  const [invoiceDistribution, setInvoiceDistribution] = useState([]);
  const [subscriptionGrowth, setSubscriptionGrowth] = useState([]);
  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [periodFilter, setPeriodFilter] = useState("This Month");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [kpiRes, mrrRes, planRes, invDistRes, growthRes, invRes, subRes, custRes] =
          await Promise.all([
            analyticsService.getDashboardKpis(),
            analyticsService.getMrrTrend(),
            analyticsService.getRevenueByPlan(),
            analyticsService.getInvoiceStatusDistribution(),
            analyticsService.getSubscriptionGrowth(),
            invoiceService.getAll({ status: "Overdue" }),
            subscriptionService.getAll({ status: "Active" }),
            customerService.getAll(),
          ]);

        setKpis(kpiRes.data);
        setMrrTrend(mrrRes.data);
        setRevenueByPlan(planRes.data);
        setInvoiceDistribution(invDistRes.data);
        setSubscriptionGrowth(growthRes.data);
        setOverdueInvoices(invRes.data);
        setUpcomingSubscriptions(subRes.data.slice(0, 4));
        setRecentCustomers(custRes.data.slice(0, 4));
      } catch (err) {
        console.error("Error loading admin dashboard data:", err);
      }
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Overview"
        description="Comprehensive real-time view of subscription health, revenue metrics, and cash flow."
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-600 gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Oct 2024</span>
            </div>
            <Link to="/ai-insights">
              <Button variant="outline" size="sm" icon={Sparkles} className="bg-indigo-50/50 text-indigo-700 border-indigo-200">
                Ask ValenceIQ Copilot
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Grid (8 Essential SaaS Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(kpis?.mrr)}
          subtitle="vs ₹31.9k last mo"
          trend="+10.2%"
          trendType="up"
          icon={TrendingUp}
        />
        <StatCard
          title="Annual Recurring Revenue"
          value={formatCurrency(kpis?.arr)}
          subtitle="Run-rate estimate"
          badgeText="ARR"
          icon={Repeat}
        />
        <StatCard
          title="Cash Collected"
          value={formatCurrency(kpis?.revenueCollected)}
          subtitle="73.1% collection rate"
          trend="+5.9%"
          trendType="up"
          icon={CreditCard}
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(kpis?.outstandingBalance)}
          subtitle="1 account overdue"
          trend="Action required"
          trendType="down"
          icon={AlertCircle}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={kpis?.totalCustomers || "6"}
          subtitle="Across enterprise tiers"
          trend="+1 this month"
          trendType="up"
          icon={Users}
        />
        <StatCard
          title="Active Subscriptions"
          value={kpis?.activeSubscriptions || "5"}
          subtitle="1 currently paused"
          trendType="neutral"
          icon={Repeat}
        />
        <StatCard
          title="Overdue Invoices"
          value={kpis?.overdueInvoicesCount || "1"}
          subtitle={formatCurrency(kpis?.overdueInvoicesAmount)}
          trend="Flagged for follow-up"
          trendType="down"
          icon={AlertCircle}
        />
        <StatCard
          title="Customer Churn Rate"
          value={`${kpis?.churnRate || 2.1}%`}
          subtitle="Healthy SaaS benchmark (<3%)"
          trend="-0.4% QoQ"
          trendType="up"
          icon={CheckCircle2}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MRR & Collections Trend */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Revenue & Cash Collections Trend"
            subtitle="Monthly recurring revenue trajectory compared to actual cash realized"
          />
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Area type="monotone" dataKey="mrr" name="MRR (Contracted)" stroke="#1e40af" strokeWidth={2} fillOpacity={1} fill="url(#colorMrr)" />
                <Area type="monotone" dataKey="cashCollected" name="Cash Realized" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCash)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Invoice Status Distribution */}
        <Card>
          <CardHeader
            title="Invoice Portfolio Distribution"
            subtitle="Current billing cycle status breakdown"
          />
          <CardContent className="h-72 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="75%">
              <PieChart>
                <Pie
                  data={invoiceDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {invoiceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name, item) => [`${val} invoices (${formatCurrency(item.payload.amount)})`, name]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 text-2xs pt-2 border-t border-slate-100">
              {invoiceDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <Card>
          <CardHeader
            title="Contract Revenue by Subscription Plan"
            subtitle="Contribution breakdown of platform packages"
          />
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByPlan} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis type="category" dataKey="plan" tick={{ fontSize: 10, fill: "#475569" }} width={120} />
                <Tooltip
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0", fontSize: "12px" }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Growth */}
        <Card>
          <CardHeader
            title="Subscription Retention & Growth"
            subtitle="Net active subscriptions vs monthly additions"
          />
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subscriptionGrowth} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "4px" }} />
                <Line type="monotone" dataKey="active" name="Total Active" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="new" name="New Subscriptions" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Operational Highlights Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Invoices Alert Panel */}
        <Card>
          <CardHeader
            title="Attention Required: Overdue Receivables"
            subtitle="Invoices exceeding payment term limits"
            action={
              <Link to="/invoices?status=Overdue" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          <div className="divide-y divide-slate-100">
            {overdueInvoices.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-500">No overdue invoices found.</p>
            ) : (
              overdueInvoices.map((inv) => (
                <div key={inv.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{inv.invoiceNumber}</span>
                      <Badge status={inv.status} />
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5">{inv.customerName}</p>
                    <p className="text-2xs text-rose-600 mt-0.5">Due date: {inv.dueDate} (Action pending)</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-slate-900">{formatCurrency(inv.balanceDue)}</p>
                    <Link to={`/invoices`}>
                      <span className="text-2xs text-blue-600 hover:underline">Follow up</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Renewals */}
        <Card>
          <CardHeader
            title="Upcoming Subscription Renewals"
            subtitle="Contracts approaching billing renewal within 30 days"
            action={
              <Link to="/subscriptions" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          <div className="divide-y divide-slate-100">
            {upcomingSubscriptions.map((sub) => (
              <div key={sub.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{sub.subscriptionNumber}</span>
                    <Badge status={sub.status} />
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">{sub.customerName}</p>
                  <p className="text-2xs text-slate-500 mt-0.5">{sub.planName} • Next billing: {sub.nextBillingDate}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-slate-900">{formatCurrency(sub.subscriptionValue)}</p>
                  <span className="text-3xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    Auto-Renew
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
