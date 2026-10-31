import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatCard, Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { analyticsService } from "../../services/analyticsService";
import {
  TrendingUp,
  CreditCard,
  AlertCircle,
  Repeat,
  Download,
  Calendar,
  Filter,
  BarChart2,
  PieChart as PieIcon,
  HelpCircle,
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

export const AnalyticsPage = () => {
  const [kpis, setKpis] = useState(null);
  const [mrrTrend, setMrrTrend] = useState([]);
  const [revenueByPlan, setRevenueByPlan] = useState([]);
  const [invoiceDistribution, setInvoiceDistribution] = useState([]);
  const [subscriptionGrowth, setSubscriptionGrowth] = useState([]);
  const [invoiceAging, setInvoiceAging] = useState([]);
  const [timeFilter, setTimeFilter] = useState("Last 6 Months");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [kpiRes, mrrRes, planRes, distRes, growthRes, agingRes] = await Promise.all([
          analyticsService.getDashboardKpis(),
          analyticsService.getMrrTrend(),
          analyticsService.getRevenueByPlan(),
          analyticsService.getInvoiceStatusDistribution(),
          analyticsService.getSubscriptionGrowth(),
          analyticsService.getInvoiceAging(),
        ]);

        setKpis(kpiRes.data);
        setMrrTrend(mrrRes.data);
        setRevenueByPlan(planRes.data);
        setInvoiceDistribution(distRes.data);
        setSubscriptionGrowth(growthRes.data);
        setInvoiceAging(agingRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadAnalytics();
  }, [timeFilter]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Analytics & Financial Intelligence"
        description="Comprehensive accounting metrics, recurring revenue run-rates, invoice aging analysis, and cohort retention."
        action={
          <div className="flex items-center gap-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs focus:outline-none"
            >
              <option value="Current Month">Current Month (Oct 2024)</option>
              <option value="Last 6 Months">Last 6 Months Trajectory</option>
              <option value="Year to Date">Year to Date (FY 2024-25)</option>
            </select>
            <Button variant="outline" size="sm" icon={Download}>
              Export Report
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Recurring Revenue (MRR)"
          value={formatCurrency(kpis?.mrr)}
          subtitle="Normalized monthly recurring fees"
          trend="+10.2% MoM"
          trendType="up"
          icon={TrendingUp}
        />
        <StatCard
          title="Annual Recurring Revenue (ARR)"
          value={formatCurrency(kpis?.arr)}
          subtitle="MRR annualized (MRR × 12)"
          badgeText="ARR Run-Rate"
          icon={Repeat}
        />
        <StatCard
          title="Cash Collections Realized"
          value={formatCurrency(kpis?.revenueCollected)}
          subtitle={`${kpis?.collectionRate}% of billed invoices`}
          trend="+5.9% vs Sep"
          trendType="up"
          icon={CreditCard}
        />
        <StatCard
          title="Customer Churn Rate"
          value={`${kpis?.churnRate}%`}
          subtitle="Mock annualized retention index"
          trend="-0.4% QoQ"
          trendType="up"
          icon={BarChart2}
        />
      </div>

      {/* Financial Chart: MRR vs Realized Cash vs SaaS Expenses */}
      <Card>
        <CardHeader
          title="Recurring Revenue vs Cash Collections & Infrastructure Cost"
          subtitle="Comparison of contracted recurring commitments vs actual settled cash and AWS/GCP operating expenditures"
        />
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mrrTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="anaMrr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="anaCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                formatter={(val) => formatCurrency(val)}
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0", fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Area type="monotone" dataKey="mrr" name="Contracted MRR" stroke="#1e3a8a" strokeWidth={2.5} fill="url(#anaMrr)" />
              <Area type="monotone" dataKey="cashCollected" name="Realized Cash" stroke="#10b981" strokeWidth={2} fill="url(#anaCash)" />
              <Line type="monotone" dataKey="expenses" name="Cloud Cost & Overheads" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two Column Section: Invoice Aging & Plan Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Aging Schedule */}
        <Card>
          <CardHeader
            title="Invoice Aging Schedule & Exposure"
            subtitle="Outstanding receivable balances bucketed by days past issuance"
          />
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={invoiceAging} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(val, name, item) => [
                    `${formatCurrency(val)} (${item.payload.count} account${item.payload.count === 1 ? "" : "s"})`,
                    "Outstanding Amount",
                  ]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0", fontSize: "12px" }}
                />
                <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Contribution by Plan */}
        <Card>
          <CardHeader
            title="Package Revenue Contribution"
            subtitle="Tier breakdown of subscription billings"
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
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Metric Definitions & Methodology Documentation */}
      <Card className="p-6 bg-slate-50 border-slate-200">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-500" /> Financial Metric Definitions & Reporting Methodology
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 mt-3">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <p className="font-semibold text-slate-800">Monthly Recurring Revenue (MRR)</p>
            <p className="text-2xs text-slate-500 mt-1">
              Normalized monthly recurring software subscription charges, excluding one-time setup and hardware fees.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <p className="font-semibold text-slate-800">Realized Cash Collections</p>
            <p className="text-2xs text-slate-500 mt-1">
              Confirmed cleared funds received in banking accounts via credit card, UPI, or NEFT wire transfers within the calendar period.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <p className="font-semibold text-slate-800">Collection Rate Ratio</p>
            <p className="text-2xs text-slate-500 mt-1">
              Percentage of invoices billed in the cycle that have reached 'Paid' status (Currently at 73.1% healthy benchmark).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
