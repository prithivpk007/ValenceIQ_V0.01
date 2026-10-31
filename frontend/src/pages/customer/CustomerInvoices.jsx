import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { invoiceService } from "../../services/invoiceService";
import { paymentService } from "../../services/paymentService";
import { Printer, CreditCard, Download, CheckCircle2, FileText, ArrowRight } from "lucide-react";

export const CustomerInvoices = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const customerId = user?.customerId || "cust_1";

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const fetchInvoices = async () => {
    const res = await invoiceService.getAll({ customerId });
    setInvoices(res.data);
  };

  useEffect(() => {
    fetchInvoices();
  }, [customerId]);

  const handlePayNow = async (invoice) => {
    setIsPaying(true);
    try {
      await paymentService.recordPayment({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        customerName: invoice.customerName,
        amount: invoice.balanceDue,
        paymentMethod: "Credit Card (Customer Portal)",
        reference: `PORTAL_PAY_${Date.now()}`,
        notes: "Self-service online portal settlement",
      });
      showToast(`Payment of ₹${invoice.balanceDue} processed successfully!`, "success");
      fetchInvoices();
      setIsPreviewOpen(false);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsPaying(false);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Invoices"
        description="Review all past and current billing statements, download print-friendly invoices, and settle balances."
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3.5 pl-5">Invoice Number</th>
                <th className="p-3.5">Billing Period</th>
                <th className="p-3.5">Invoice Date</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Balance Due</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-5 font-semibold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="p-3.5 font-medium">{inv.billingPeriod}</td>
                  <td className="p-3.5 text-slate-500">{inv.invoiceDate}</td>
                  <td className="p-3.5 text-slate-500">{inv.dueDate}</td>
                  <td className="p-3.5 font-bold text-slate-900">{formatCurrency(inv.total)}</td>
                  <td className="p-3.5 font-bold text-rose-600">
                    {inv.balanceDue > 0 ? formatCurrency(inv.balanceDue) : "₹0"}
                  </td>
                  <td className="p-3.5">
                    <Badge status={inv.status} />
                  </td>
                  <td className="p-3.5 pr-5 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setIsPreviewOpen(true);
                      }}
                    >
                      View Invoice
                    </Button>
                    {inv.balanceDue > 0 && (
                      <Button
                        variant="primary"
                        size="xs"
                        icon={CreditCard}
                        onClick={() => handlePayNow(inv)}
                        isLoading={isPaying}
                      >
                        Pay Now
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Printable Invoice Modal Preview */}
      {selectedInvoice && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Tax Invoice: ${selectedInvoice.invoiceNumber}`}
          subtitle="ValenceIQ Financial Systems Pvt Ltd • Formal Billing Document"
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-2xs text-slate-400">
                Phase 1 Preview • Print / Save as PDF available via browser
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()}>
                  Print Invoice
                </Button>
                {selectedInvoice.balanceDue > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CreditCard}
                    onClick={() => handlePayNow(selectedInvoice)}
                    isLoading={isPaying}
                  >
                    Pay Balance ({formatCurrency(selectedInvoice.balanceDue)})
                  </Button>
                )}
              </div>
            </div>
          }
        >
          {/* Printable Layout */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 text-slate-800 font-sans print:border-none print:p-0">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">ValenceIQ Financial Systems Pvt. Ltd.</h2>
                <p className="text-xs text-slate-500 mt-1">Embassy TechVillage, Tower 2B, Bengaluru, KA 560103</p>
                <p className="text-xs text-slate-500">GSTIN: 29AAACB1234F1Z8 • billing@valenceiq.com</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  ORIGINAL TAX INVOICE
                </span>
                <span className="text-lg font-extrabold text-blue-900 block mt-1">
                  {selectedInvoice.invoiceNumber}
                </span>
                <Badge status={selectedInvoice.status} className="mt-1" />
              </div>
            </div>

            {/* Bill To & Invoice Info */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div>
                <p className="font-semibold uppercase tracking-wider text-slate-400 text-2xs mb-1">Billed To:</p>
                <p className="font-bold text-slate-900 text-sm">{selectedInvoice.customerName}</p>
                <p className="text-slate-600 mt-0.5">GSTIN: GSTIN29AAACT9876Q1Z5</p>
                <p className="text-slate-500 mt-0.5">Bengaluru, Karnataka, India</p>
              </div>
              <div className="text-right space-y-1">
                <p><span className="text-slate-400">Invoice Date:</span> <span className="font-medium">{selectedInvoice.invoiceDate}</span></p>
                <p><span className="text-slate-400">Payment Due:</span> <span className="font-medium text-rose-600">{selectedInvoice.dueDate}</span></p>
                <p><span className="text-slate-400">Billing Cycle:</span> <span className="font-medium">{selectedInvoice.billingPeriod}</span></p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium text-slate-900">{item.description}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-3 text-right font-semibold">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Calculation */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-2 border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                {selectedInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount Applied:</span>
                    <span>-{formatCurrency(selectedInvoice.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%):</span>
                  <span>{formatCurrency(selectedInvoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Invoice Total:</span>
                  <span>{formatCurrency(selectedInvoice.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Amount Paid:</span>
                  <span>{formatCurrency(selectedInvoice.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-rose-600 border-t border-slate-200 pt-2">
                  <span>Balance Due:</span>
                  <span>{formatCurrency(selectedInvoice.balanceDue)}</span>
                </div>
              </div>
            </div>

            {/* Notes / Footer */}
            <div className="p-3 bg-slate-50 rounded-lg text-2xs text-slate-500">
              <p className="font-semibold text-slate-700">Payment & Bank Details:</p>
              <p>HDFC Bank • A/C No: 50200088192837 • IFSC: HDFC0000240 • Embassy TechVillage Branch</p>
              <p className="mt-1">{selectedInvoice.notes}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
