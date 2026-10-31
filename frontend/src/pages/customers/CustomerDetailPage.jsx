import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Tabs } from "../../components/common/Tabs";
import { customerService } from "../../services/customerService";
import { subscriptionService } from "../../services/subscriptionService";
import { quotationService } from "../../services/quotationService";
import { invoiceService } from "../../services/invoiceService";
import { paymentService } from "../../services/paymentService";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Repeat,
  Receipt,
  CreditCard,
  Clock,
  ArrowLeft,
  Plus,
} from "lucide-react";

export const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("subscriptions");

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        const custId = id || "cust_1";
        const [custRes, subRes, quoRes, invRes, payRes] = await Promise.all([
          customerService.getById(custId),
          subscriptionService.getAll({ customerId: custId }),
          quotationService.getAll({ customerId: custId }),
          invoiceService.getAll({ customerId: custId }),
          paymentService.getAll({ customerId: custId }),
        ]);

        setCustomer(custRes.data);
        setSubscriptions(subRes.data);
        setQuotations(quoRes.data);
        setInvoices(invRes.data);
        setPayments(payRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCustomerData();
  }, [id]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  if (!customer) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Loading customer profile...
      </div>
    );
  }

  const tabs = [
    { id: "subscriptions", label: "Subscriptions", count: subscriptions.length, icon: Repeat },
    { id: "quotations", label: "Quotations", count: quotations.length, icon: FileText },
    { id: "invoices", label: "Invoices", count: invoices.length, icon: Receipt },
    { id: "payments", label: "Payments", count: payments.length, icon: CreditCard },
    { id: "timeline", label: "Activity Timeline", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link to="/customers" className="hover:text-blue-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Customers
        </Link>
      </div>

      {/* Customer 360 Profile Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 m-0">{customer.name}</h1>
              <Badge status={customer.status} />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {customer.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {customer.phone}</span>
              <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-slate-400" /> GSTIN: {customer.taxId}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {customer.billingAddress}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-2xs uppercase tracking-wider text-slate-400 font-semibold block">Total Revenue</span>
              <span className="text-xl font-bold text-slate-900">{formatCurrency(customer.totalSpent)}</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 text-right">
              <span className="text-2xs text-blue-700 block font-medium">Assigned AE</span>
              <span className="font-semibold text-xs">{customer.assignedStaff}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === "subscriptions" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Subscription #</th>
                  <th className="p-3.5">Plan Name</th>
                  <th className="p-3.5">Start Date</th>
                  <th className="p-3.5">Expiry Date</th>
                  <th className="p-3.5">Billing Interval</th>
                  <th className="p-3.5">Value</th>
                  <th className="p-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {subscriptions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 pl-5 font-semibold text-slate-900">{s.subscriptionNumber}</td>
                    <td className="p-3.5 font-medium">{s.planName}</td>
                    <td className="p-3.5">{s.startDate}</td>
                    <td className="p-3.5">{s.expiryDate}</td>
                    <td className="p-3.5">{s.billingInterval}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(s.subscriptionValue)}</td>
                    <td className="p-3.5 pr-5"><Badge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "quotations" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Quote Number</th>
                  <th className="p-3.5">Agreement Template</th>
                  <th className="p-3.5">Created Date</th>
                  <th className="p-3.5">Validity Expiry</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 pl-5 font-semibold text-slate-900">{q.quotationNumber}</td>
                    <td className="p-3.5">{q.template}</td>
                    <td className="p-3.5">{q.createdDate}</td>
                    <td className="p-3.5">{q.validityDate}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(q.finalTotal)}</td>
                    <td className="p-3.5 pr-5"><Badge status={q.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "invoices" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Invoice #</th>
                  <th className="p-3.5">Billing Period</th>
                  <th className="p-3.5">Invoice Date</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Balance Due</th>
                  <th className="p-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 pl-5 font-semibold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="p-3.5">{inv.billingPeriod}</td>
                    <td className="p-3.5">{inv.invoiceDate}</td>
                    <td className="p-3.5">{inv.dueDate}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(inv.total)}</td>
                    <td className="p-3.5 font-bold text-rose-600">{formatCurrency(inv.balanceDue)}</td>
                    <td className="p-3.5 pr-5"><Badge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "payments" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Receipt Ref</th>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5">Transaction ID</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 pl-5 font-semibold text-slate-900">{p.paymentNumber}</td>
                    <td className="p-3.5">{p.invoiceNumber}</td>
                    <td className="p-3.5">{p.paymentMethod}</td>
                    <td className="p-3.5 font-mono text-2xs text-slate-500">{p.reference}</td>
                    <td className="p-3.5">{p.paymentDate}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(p.amount)}</td>
                    <td className="p-3.5 pr-5"><Badge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "timeline" && (
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Account Interaction Timeline</h3>
          <div className="border-l-2 border-blue-600 pl-4 space-y-4">
            <div className="text-xs relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
              <p className="font-semibold text-slate-900">2024-10-18</p>
              <p className="text-slate-600 mt-0.5">Corporate card payment of ₹5,900 received for Invoice INV-2024-00301.</p>
            </div>
            <div className="text-xs relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
              <p className="font-semibold text-slate-900">2024-10-15</p>
              <p className="text-slate-600 mt-0.5">Automated recurring invoice INV-2024-00301 generated.</p>
            </div>
            <div className="text-xs relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
              <p className="font-semibold text-slate-900">2024-08-15</p>
              <p className="text-slate-600 mt-0.5">Account upgraded to Enterprise Intelligence Plan.</p>
            </div>
            <div className="text-xs relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
              <p className="font-semibold text-slate-900">2024-02-15</p>
              <p className="text-slate-600 mt-0.5">Customer onboarded and initial subscription SUB-BL-2024-1001 activated.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
