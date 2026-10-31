import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatCard, Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input, Select } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { EmptyState } from "../../components/common/EmptyState";
import { useNotifications } from "../../context/NotificationContext";
import { paymentService } from "../../services/paymentService";
import { invoiceService } from "../../services/invoiceService";
import { customerService } from "../../services/customerService";
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";

export const PaymentsPage = () => {
  const { showToast } = useNotifications();
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");

  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [formData, setFormData] = useState({
    invoiceId: "",
    invoiceNumber: "",
    customerId: "cust_1",
    customerName: "TechScale Solutions Pvt Ltd",
    amount: 5000,
    paymentMethod: "Credit Card (Corporate)",
    reference: `RZP_TXN_${Date.now()}`,
    notes: "Manual payment recording via finance console",
    status: "Successful",
  });

  const loadData = async () => {
    try {
      const [payRes, invRes, custRes] = await Promise.all([
        paymentService.getAll({ search, method: methodFilter }),
        invoiceService.getAll(),
        customerService.getAll(),
      ]);
      setPayments(payRes.data);
      setInvoices(invRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, methodFilter]);

  const handleOpenRecord = () => {
    const inv = invoices.find((i) => i.balanceDue > 0) || invoices[0];
    setFormData({
      invoiceId: inv ? inv.id : "",
      invoiceNumber: inv ? inv.invoiceNumber : "",
      customerId: inv ? inv.customerId : "cust_1",
      customerName: inv ? inv.customerName : "TechScale Solutions Pvt Ltd",
      amount: inv ? inv.balanceDue : 2500,
      paymentMethod: "Credit Card (Corporate)",
      reference: `RZP_TXN_${Date.now()}`,
      notes: "Direct finance console entry",
      status: "Successful",
    });
    setIsRecordOpen(true);
  };

  const handleInvoiceChange = (invId) => {
    const inv = invoices.find((i) => i.id === invId);
    if (inv) {
      setFormData({
        ...formData,
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        customerId: inv.customerId,
        customerName: inv.customerName,
        amount: inv.balanceDue || inv.total,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await paymentService.recordPayment(formData);
      showToast("Payment recorded and reconciled successfully", "success");
      setIsRecordOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  const totalCollected = payments.reduce((acc, p) => acc + (p.status === "Successful" ? Number(p.amount) : 0), 0);
  const successfulCount = payments.filter((p) => p.status === "Successful").length;
  const pendingCount = payments.filter((p) => p.status === "Pending").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Operations & Reconciliations"
        description="Audit multi-channel collections, corporate cards, UPI rails, and bank wire reconciliations."
        action={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenRecord}>
            Record Payment
          </Button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Cash Collected"
          value={formatCurrency(totalCollected)}
          subtitle="Realized this fiscal cycle"
          trend="+12.4% MoM"
          trendType="up"
          icon={CreditCard}
        />
        <StatCard
          title="Settled Transactions"
          value={successfulCount}
          subtitle="100% gateway reconciliation"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending / Disputed"
          value={pendingCount}
          subtitle="Card auth or retry required"
          trendType={pendingCount > 0 ? "down" : "neutral"}
          icon={AlertCircle}
        />
        <StatCard
          title="Top Settlement Rail"
          value="Corporate Cards"
          subtitle="58% of gross volume"
          badgeText="Cards"
          icon={CreditCard}
        />
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by receipt #, customer name, transaction reference..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Settlement Methods</option>
            <option value="Credit Card (Corporate)">Corporate Credit Card</option>
            <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT)</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
          </select>
        </div>
      </Card>

      {/* Payments Table */}
      <Card>
        {payments.length === 0 ? (
          <EmptyState
            title="No payments recorded"
            description="Record a customer payment to update invoice balances."
            actionText="Record Payment"
            onAction={handleOpenRecord}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Receipt Ref</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Invoice Number</th>
                  <th className="p-3.5">Settlement Rail</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5 font-semibold text-slate-900">{p.paymentNumber}</td>
                    <td className="p-3.5 font-medium">{p.customerName}</td>
                    <td className="p-3.5 text-blue-700 font-medium">{p.invoiceNumber}</td>
                    <td className="p-3.5">{p.paymentMethod}</td>
                    <td className="p-3.5 text-slate-500">{p.paymentDate}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(p.amount)}</td>
                    <td className="p-3.5">
                      <Badge status={p.status} />
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={Eye}
                        onClick={() => {
                          setSelectedPayment(p);
                          setIsDetailOpen(true);
                        }}
                      >
                        Audit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Record Payment Form Modal */}
      <Modal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
        title="Record Incoming Payment"
        subtitle="Settle customer balances and reconcile associated billing invoices"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsRecordOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Record & Reconcile
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Associate With Invoice"
            id="rec-inv"
            value={formData.invoiceId}
            onChange={(e) => handleInvoiceChange(e.target.value)}
            options={invoices.map((inv) => ({
              value: inv.id,
              label: `${inv.invoiceNumber} — ${inv.customerName} (Bal: ${formatCurrency(inv.balanceDue)})`,
            }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Payment Amount (₹)"
              id="rec-amt"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              required
            />
            <Select
              label="Settlement Rail"
              id="rec-method"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              options={[
                { value: "Credit Card (Corporate)", label: "Credit Card (Corporate)" },
                { value: "Bank Transfer (NEFT)", label: "Bank Transfer (NEFT / RTGS)" },
                { value: "UPI", label: "UPI" },
                { value: "Net Banking", label: "Net Banking" },
              ]}
            />
          </div>

          <Input
            label="Payment Gateway / Bank Transaction Ref"
            id="rec-ref"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            placeholder="e.g. RZP_TXN_99881122"
            required
          />

          <Input
            label="Internal Settlement Note"
            id="rec-notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notes regarding payer authorization or clearance"
          />
        </form>
      </Modal>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Payment Receipt: ${selectedPayment.paymentNumber}`}
          subtitle="Reconciled Transaction Audit"
          size="sm"
        >
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-900">{selectedPayment.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Settled Invoice:</span>
                <span className="font-medium text-blue-700">{selectedPayment.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedPayment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span>{selectedPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway Ref:</span>
                <span className="font-mono text-2xs">{selectedPayment.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Settlement Time:</span>
                <span>{selectedPayment.paymentDate}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500">Gateway Status:</span>
                <Badge status={selectedPayment.status} />
              </div>
            </div>

            <p className="text-2xs text-slate-500 italic p-2 bg-blue-50/50 rounded-lg">
              {selectedPayment.notes}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
