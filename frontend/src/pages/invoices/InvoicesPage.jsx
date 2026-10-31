import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input, Select } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { EmptyState } from "../../components/common/EmptyState";
import { useNotifications } from "../../context/NotificationContext";
import { invoiceService } from "../../services/invoiceService";
import { paymentService } from "../../services/paymentService";
import { customerService } from "../../services/customerService";
import {
  Receipt,
  Search,
  Plus,
  Printer,
  CreditCard,
  Eye,
  Calendar,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export const InvoicesPage = () => {
  const { showToast } = useNotifications();
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Record payment form
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card (Corporate)");
  const [paymentReference, setPaymentReference] = useState("");

  // Create invoice form
  const [createForm, setCreateForm] = useState({
    customerId: "cust_1",
    customerName: "TechScale Solutions Pvt Ltd",
    billingPeriod: "01 Nov 2024 - 30 Nov 2024",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    subtotal: 5000,
    discountAmount: 0,
    taxRate: 18,
    status: "Confirmed",
    notes: "Direct manual invoice billing",
    items: [{ description: "Custom Professional SaaS Tier", quantity: 1, unitPrice: 5000, total: 5000 }],
  });

  const loadData = async () => {
    try {
      const [invRes, custRes] = await Promise.all([
        invoiceService.getAll({ search, status: statusFilter }),
        customerService.getAll(),
      ]);
      setInvoices(invRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const handleOpenPayment = (inv) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.balanceDue);
    setPaymentReference(`TXN_${Date.now()}`);
    setIsPaymentOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      showToast("Please enter a valid payment amount", "error");
      return;
    }
    try {
      await paymentService.recordPayment({
        invoiceId: selectedInvoice.id,
        invoiceNumber: selectedInvoice.invoiceNumber,
        customerId: selectedInvoice.customerId,
        customerName: selectedInvoice.customerName,
        amount: Number(paymentAmount),
        paymentMethod,
        reference: paymentReference || `MOCK_REF_${Date.now()}`,
        notes: "Direct payment recorded via billing console",
      });
      showToast(`Recorded payment of ₹${paymentAmount} successfully!`, "success");
      setIsPaymentOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const cust = customers.find((c) => c.id === createForm.customerId);
      await invoiceService.create({
        ...createForm,
        customerName: cust ? cust.name : createForm.customerName,
      });
      showToast("Invoice generated successfully", "success");
      setIsCreateOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices & Billing Statements"
        description="Monitor automated recurring invoices, reconcile incoming settlements, and issue print-friendly statements."
        action={
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCreateOpen(true)}>
            Create Invoice
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice number, customer company, or package..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Draft">Draft</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card>
        {invoices.length === 0 ? (
          <EmptyState
            title="No invoices found"
            description="No billing statements match your current search criteria."
            actionText="Generate Invoice"
            onAction={() => setIsCreateOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Invoice #</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Billing Period</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Amount Paid</th>
                  <th className="p-3.5">Balance Due</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5 font-semibold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="p-3.5 font-medium">{inv.customerName}</td>
                    <td className="p-3.5 text-slate-500">{inv.billingPeriod}</td>
                    <td className="p-3.5 text-slate-600">{inv.dueDate}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(inv.total)}</td>
                    <td className="p-3.5 font-medium text-emerald-700">{formatCurrency(inv.amountPaid)}</td>
                    <td className="p-3.5 font-bold text-rose-600">
                      {inv.balanceDue > 0 ? formatCurrency(inv.balanceDue) : "₹0"}
                    </td>
                    <td className="p-3.5">
                      <Badge status={inv.status} />
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-1.5">
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={Eye}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setIsPreviewOpen(true);
                        }}
                      >
                        Preview
                      </Button>

                      {inv.balanceDue > 0 && inv.status !== "Cancelled" && (
                        <Button
                          variant="secondary"
                          size="xs"
                          icon={CreditCard}
                          onClick={() => handleOpenPayment(inv)}
                        >
                          Record Payment
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Record Payment Form Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          title={`Record Payment for ${selectedInvoice.invoiceNumber}`}
          subtitle={`Client: ${selectedInvoice.customerName} • Outstanding: ${formatCurrency(selectedInvoice.balanceDue)}`}
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsPaymentOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleRecordPayment}>
                Confirm Payment Receipt
              </Button>
            </>
          }
        >
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <Input
              label="Amount to Settle (₹)"
              id="pay-amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
            />

            <Select
              label="Settlement Method"
              id="pay-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={[
                { value: "Credit Card (Corporate)", label: "Credit Card (Corporate)" },
                { value: "Bank Transfer (NEFT)", label: "Bank Transfer (NEFT / RTGS)" },
                { value: "UPI", label: "UPI Corporate Handle" },
                { value: "Net Banking", label: "Net Banking" },
                { value: "Cheque / Wire", label: "Cheque / Corporate Wire" },
              ]}
            />

            <Input
              label="Transaction / Reference ID"
              id="pay-ref"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="e.g. RZP_TXN_99881122 or Bank Ref"
              required
            />
          </form>
        </Modal>
      )}

      {/* Printable Invoice Modal Preview */}
      {selectedInvoice && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Tax Invoice Preview: ${selectedInvoice.invoiceNumber}`}
          subtitle="ValenceIQ Financial Analyst • Original Tax Statement"
          size="lg"
          footer={
            <div className="flex justify-between w-full">
              <span className="text-2xs text-slate-400">
                Print / Save as PDF available via browser
              </span>
              <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()}>
                Print Invoice
              </Button>
            </div>
          }
        >
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 text-xs text-slate-800 print:border-none print:p-0">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">ValenceIQ Financial Systems Pvt. Ltd.</h2>
                <p className="text-slate-500 text-2xs mt-0.5">Embassy TechVillage, Tower 2B, Bengaluru, KA 560103</p>
                <p className="text-slate-500 text-2xs">GSTIN: 29AAACB1234F1Z8</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-base text-blue-900 block">{selectedInvoice.invoiceNumber}</span>
                <Badge status={selectedInvoice.status} className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xs font-semibold uppercase text-slate-400">Billed Customer:</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedInvoice.customerName}</p>
                <p className="text-slate-500 text-2xs mt-1">Billing Period: {selectedInvoice.billingPeriod}</p>
              </div>
              <div className="text-right">
                <p><span className="text-slate-400">Invoice Date:</span> {selectedInvoice.invoiceDate}</p>
                <p><span className="text-slate-400">Due Date:</span> <span className="font-semibold text-rose-600">{selectedInvoice.dueDate}</span></p>
              </div>
            </div>

            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-medium">{item.description}</td>
                    <td className="p-2.5 text-center">{item.quantity}</td>
                    <td className="p-2.5 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-2.5 text-right font-semibold">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                {selectedInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedInvoice.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>GST ({selectedInvoice.taxRate || 18}%):</span>
                  <span>{formatCurrency(selectedInvoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(selectedInvoice.total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Paid so far:</span>
                  <span>{formatCurrency(selectedInvoice.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-rose-600 border-t border-slate-200 pt-2">
                  <span>Balance Due:</span>
                  <span>{formatCurrency(selectedInvoice.balanceDue)}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-2xs text-slate-500">
              <p className="font-semibold text-slate-700">Bank Reconcile Instructions:</p>
              <p>RTGS / NEFT to HDFC Bank A/C: 50200088192837 • IFSC: HDFC0000240</p>
              <p className="mt-1">{selectedInvoice.notes}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Manual Invoice Creation Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Recurring Invoice"
        subtitle="Issue an ad-hoc or cycle invoice for an enterprise account"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateInvoice}>
              Generate Invoice
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <Select
            label="Customer"
            id="inv-cust"
            value={createForm.customerId}
            onChange={(e) => setCreateForm({ ...createForm, customerId: e.target.value })}
            options={customers.map((c) => ({ value: c.id, label: c.name }))}
            required
          />

          <Input
            label="Billing Period"
            id="inv-period"
            value={createForm.billingPeriod}
            onChange={(e) => setCreateForm({ ...createForm, billingPeriod: e.target.value })}
            placeholder="e.g. 01 Nov 2024 - 30 Nov 2024"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Invoice Date"
              id="inv-date"
              type="date"
              value={createForm.invoiceDate}
              onChange={(e) => setCreateForm({ ...createForm, invoiceDate: e.target.value })}
              required
            />
            <Input
              label="Payment Due Date"
              id="inv-due"
              type="date"
              value={createForm.dueDate}
              onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Subtotal Amount (₹)"
              id="inv-subtotal"
              type="number"
              value={createForm.subtotal}
              onChange={(e) => {
                const sub = Number(e.target.value);
                setCreateForm({
                  ...createForm,
                  subtotal: sub,
                  items: [{ description: "Custom SaaS Subscription Service", quantity: 1, unitPrice: sub, total: sub }],
                });
              }}
              required
            />
            <Input
              label="Discount Amount (₹)"
              id="inv-disc"
              type="number"
              value={createForm.discountAmount}
              onChange={(e) => setCreateForm({ ...createForm, discountAmount: Number(e.target.value) })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
