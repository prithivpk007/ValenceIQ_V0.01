import React, { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { mockCustomers, mockSubscriptions, mockInvoices, mockQuotations } from "../../data/mockData";
import { Download, Filter, FileSpreadsheet, CheckCircle2, Clock } from "lucide-react";

export const OperationalReports = () => {
  const [selectedReport, setSelectedReport] = useState("renewals");

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operational & Follow-up Reports"
        description="Daily operational reconciliations, renewal queues, and account follow-up rosters."
        action={
          <Button variant="outline" size="sm" icon={Download}>
            Export CSV
          </Button>
        }
      />

      {/* Report Selector Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setSelectedReport("renewals")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            selectedReport === "renewals" ? "bg-blue-700 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Upcoming Renewals (30 Days)
        </button>
        <button
          onClick={() => setSelectedReport("overdue")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            selectedReport === "overdue" ? "bg-blue-700 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Overdue Account Action List
        </button>
        <button
          onClick={() => setSelectedReport("quotations")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            selectedReport === "quotations" ? "bg-blue-700 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Pipeline & Quotation Aging
        </button>
      </div>

      {selectedReport === "renewals" && (
        <Card>
          <CardHeader
            title="Active Renewals Queue (Next 30 Days)"
            subtitle="Scheduled automatic billing runs and client check-in dates"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Subscription</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Plan</th>
                  <th className="p-3.5">Interval</th>
                  <th className="p-3.5">Renewal Date</th>
                  <th className="p-3.5">Contract Value</th>
                  <th className="p-3.5 pr-5">Auto-Renewal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mockSubscriptions.filter(s => s.status === "Active").map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 pl-5 font-semibold text-slate-900">{s.subscriptionNumber}</td>
                    <td className="p-3.5 font-medium">{s.customerName}</td>
                    <td className="p-3.5">{s.planName}</td>
                    <td className="p-3.5">{s.billingInterval}</td>
                    <td className="p-3.5 font-medium text-slate-900">{s.nextBillingDate}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(s.subscriptionValue)}</td>
                    <td className="p-3.5 pr-5">
                      <span className="inline-flex items-center gap-1 text-2xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Enabled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReport === "overdue" && (
        <Card>
          <CardHeader
            title="Overdue Receivables Escalation Roster"
            subtitle="Prioritized list of customer accounts requiring collection outreach"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Invoice #</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Total Billed</th>
                  <th className="p-3.5">Amount Overdue</th>
                  <th className="p-3.5 pr-5">Assigned AE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mockInvoices.filter(i => i.status === "Overdue" || i.status === "Partially Paid").map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 pl-5 font-semibold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="p-3.5 font-medium">{inv.customerName}</td>
                    <td className="p-3.5 text-rose-600 font-medium">{inv.dueDate}</td>
                    <td className="p-3.5">{formatCurrency(inv.total)}</td>
                    <td className="p-3.5 font-bold text-rose-600">{formatCurrency(inv.balanceDue)}</td>
                    <td className="p-3.5 pr-5 text-slate-600">Priya Sharma</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReport === "quotations" && (
        <Card>
          <CardHeader
            title="Sales Quotation Pipeline & Lifecycle"
            subtitle="Status tracking from initial Draft to Confirmed active agreement"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Quote Number</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Created Date</th>
                  <th className="p-3.5">Validity Expiry</th>
                  <th className="p-3.5">Quoted Total</th>
                  <th className="p-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mockQuotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 pl-5 font-semibold text-slate-900">{q.quotationNumber}</td>
                    <td className="p-3.5 font-medium">{q.customerName}</td>
                    <td className="p-3.5 text-slate-500">{q.createdDate}</td>
                    <td className="p-3.5">{q.validityDate}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(q.finalTotal)}</td>
                    <td className="p-3.5 pr-5">
                      <Badge status={q.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
