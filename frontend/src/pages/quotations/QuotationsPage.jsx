import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input, Select } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { EmptyState } from "../../components/common/EmptyState";
import { useNotifications } from "../../context/NotificationContext";
import { quotationService } from "../../services/quotationService";
import { subscriptionService } from "../../services/subscriptionService";
import { customerService } from "../../services/customerService";
import { productService } from "../../services/productService";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Repeat,
  Printer,
  Trash2,
  PlusCircle,
  Clock,
  ArrowRight,
  Eye,
} from "lucide-react";

export const QuotationsPage = () => {
  const { showToast } = useNotifications();
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const [formData, setFormData] = useState({
    customerId: "cust_1",
    customerName: "TechScale Solutions Pvt Ltd",
    template: "Standard SaaS Agreement",
    status: "Draft",
    validityDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    paymentTerms: "Net 15",
    items: [
      {
        id: "qi_init_1",
        productId: "prod_1",
        productName: "ValenceIQ Core Financial Platform (Professional)",
        quantity: 1,
        unitPrice: 1560,
        discountPercent: 0,
        taxPercent: 18,
      },
    ],
    notes: "Formal quotation valid for 30 calendar days.",
  });

  const loadData = async () => {
    try {
      const [quoRes, custRes, prodRes] = await Promise.all([
        quotationService.getAll({ search, status: statusFilter }),
        customerService.getAll(),
        productService.getAll(),
      ]);
      setQuotations(quoRes.data);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const handleOpenCreate = () => {
    const cust = customers[0] || { id: "cust_1", name: "TechScale Solutions Pvt Ltd" };
    const prod = products[0] || { id: "prod_1", name: "ValenceIQ Core Financial Platform", baseSalesPrice: 1000 };
    setFormData({
      customerId: cust.id,
      customerName: cust.name,
      template: "Standard SaaS Agreement",
      status: "Draft",
      validityDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      paymentTerms: "Net 15",
      items: [
        {
          id: `qi_${Date.now()}`,
          productId: prod.id,
          productName: prod.name,
          quantity: 1,
          unitPrice: prod.baseSalesPrice || 1000,
          discountPercent: 0,
          taxPercent: 18,
        },
      ],
      notes: "Proposal includes 99.9% uptime SLA and email support.",
    });
    setIsCreateOpen(true);
  };

  const handleAddItem = () => {
    const prod = products[0] || { id: "prod_1", name: "ValenceIQ Core", baseSalesPrice: 1000 };
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: `qi_${Date.now()}`,
          productId: prod.id,
          productName: prod.name,
          quantity: 1,
          unitPrice: prod.baseSalesPrice || 1000,
          discountPercent: 0,
          taxPercent: 18,
        },
      ],
    });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    if (field === "productId") {
      const found = products.find((p) => p.id === value);
      if (found) {
        updated[index].productName = found.name;
        updated[index].unitPrice = found.baseSalesPrice;
      }
    }
    setFormData({ ...formData, items: updated });
  };

  const handleRemoveItem = (index) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData({ ...formData, items: updated });
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce((acc, it) => acc + Number(it.quantity) * Number(it.unitPrice), 0);
    const discount = items.reduce(
      (acc, it) => acc + Number(it.quantity) * Number(it.unitPrice) * (Number(it.discountPercent || 0) / 100),
      0
    );
    const taxable = subtotal - discount;
    const tax = (taxable * 18) / 100;
    const total = taxable + tax;
    return { subtotal, discount, tax, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customer = customers.find((c) => c.id === formData.customerId);
      const payload = {
        ...formData,
        customerName: customer ? customer.name : formData.customerName,
      };
      await quotationService.create(payload);
      showToast("Quotation created successfully", "success");
      setIsCreateOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleStatusChange = async (quo, newStatus) => {
    try {
      await quotationService.updateStatus(quo.id, newStatus);
      showToast(`Quotation status updated to ${newStatus}`, "success");
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleConvertToSubscription = async (quo) => {
    const today = new Date().toISOString().split("T")[0];
    if (quo.validityDate < today) {
      showToast("Cannot convert expired quotation to subscription.", "error");
      return;
    }
    try {
      await quotationService.updateStatus(quo.id, "Confirmed");
      await subscriptionService.createFromQuotation(quo);
      showToast("Quotation confirmed and converted to Active Subscription!", "success");
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  const formTotals = calculateTotals(formData.items);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotation & Agreement Proposals"
        description="Build multi-line commercial proposals, manage approval workflows, and convert confirmed deals into active subscriptions."
        action={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Create Quotation
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
              placeholder="Search by quote number or client name..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Quotation">Quotation (Sent)</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </Card>

      {/* Quotations Table */}
      <Card>
        {quotations.length === 0 ? (
          <EmptyState
            title="No quotations found"
            description="Create a new commercial quote or revise current search filters."
            actionText="Create Quotation"
            onAction={handleOpenCreate}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Quote Number</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Validity Expiry</th>
                  <th className="p-3.5">Terms</th>
                  <th className="p-3.5">Quoted Total</th>
                  <th className="p-3.5">Lifecycle Stage</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {quotations.map((q) => {
                  const today = new Date().toISOString().split("T")[0];
                  const isExpired = q.validityDate < today;

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-slate-900">{q.quotationNumber}</td>
                      <td className="p-3.5 font-medium">{q.customerName}</td>
                      <td className="p-3.5">
                        <span className={isExpired ? "text-rose-600 font-semibold" : "text-slate-600"}>
                          {q.validityDate}
                        </span>
                        {isExpired && <span className="block text-3xs text-rose-500 font-bold">EXPIRED</span>}
                      </td>
                      <td className="p-3.5">{q.paymentTerms}</td>
                      <td className="p-3.5 font-bold text-slate-900">{formatCurrency(q.finalTotal)}</td>
                      <td className="p-3.5">
                        <Badge status={q.status} />
                      </td>
                      <td className="p-3.5 pr-5 text-right space-x-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={Eye}
                          onClick={() => {
                            setSelectedQuote(q);
                            setIsPreviewOpen(true);
                          }}
                        >
                          View
                        </Button>

                        {q.status === "Draft" && (
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => handleStatusChange(q, "Quotation")}
                          >
                            Send to Client
                          </Button>
                        )}

                        {q.status === "Quotation" && !isExpired && (
                          <Button
                            variant="success"
                            size="xs"
                            icon={Repeat}
                            onClick={() => handleConvertToSubscription(q)}
                          >
                            Confirm & Convert
                          </Button>
                        )}

                        {q.status === "Confirmed" && (
                          <span className="text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                            Converted
                          </span>
                        )}

                        {isExpired && q.status !== "Confirmed" && (
                          <span className="text-2xs text-slate-400 italic">Ineligible for conversion</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Quotation Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Draft Commercial Quotation"
        subtitle="Dynamic line items, customer payment terms, and validity governance"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Quotation
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Select Customer"
              id="quote-customer"
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              options={customers.map((c) => ({ value: c.id, label: `${c.name} (${c.contactPerson})` }))}
              required
            />
            <Select
              label="Agreement Template"
              id="quote-template"
              value={formData.template}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              options={[
                { value: "Standard SaaS Agreement", label: "Standard SaaS Agreement" },
                { value: "Enterprise Medical SaaS", label: "Enterprise Medical SaaS" },
                { value: "Academic Discount Template", label: "Academic Discount Template" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Validity Expiration"
              id="validityDate"
              type="date"
              value={formData.validityDate}
              onChange={(e) => setFormData({ ...formData, validityDate: e.target.value })}
              required
            />
            <Select
              label="Payment Terms"
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              options={[
                { value: "Immediate", label: "Immediate on Receipt" },
                { value: "Net 15", label: "Net 15 Days" },
                { value: "Net 30", label: "Net 30 Days" },
              ]}
            />
            <Select
              label="Initial Status"
              id="quote-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: "Draft", label: "Draft (Internal Only)" },
                { value: "Quotation", label: "Quotation (Sent to Client)" },
              ]}
            />
          </div>

          {/* Dynamic Line Items */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quotation Line Items
              </h4>
              <Button type="button" variant="outline" size="xs" icon={PlusCircle} onClick={handleAddItem}>
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, idx) => (
                <div key={item.id || idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  <div className="grow w-full">
                    <label className="text-3xs uppercase font-semibold text-slate-400 block mb-0.5">Software / Service</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(idx, "productId", e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Base: ₹{p.baseSalesPrice})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-20 shrink-0">
                    <label className="text-3xs uppercase font-semibold text-slate-400 block mb-0.5">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div className="w-28 shrink-0">
                    <label className="text-3xs uppercase font-semibold text-slate-400 block mb-0.5">Unit Price (₹)</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div className="w-20 shrink-0">
                    <label className="text-3xs uppercase font-semibold text-slate-400 block mb-0.5">Disc %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discountPercent}
                      onChange={(e) => handleItemChange(idx, "discountPercent", Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer mt-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Calculations Summary */}
            <div className="flex justify-end pt-4">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(formTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(formTotals.discount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%):</span>
                  <span>{formatCurrency(formTotals.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-200 pt-2">
                  <span>Final Total:</span>
                  <span>{formatCurrency(formTotals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Printable Quotation Preview Modal */}
      {selectedQuote && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Quotation Preview: ${selectedQuote.quotationNumber}`}
          subtitle="ValenceIQ Financial Analyst Commercial Proposal"
          size="lg"
          footer={
            <div className="flex justify-between w-full">
              <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()}>
                Print Quotation
              </Button>
              {selectedQuote.status === "Quotation" && (
                <Button
                  variant="success"
                  size="sm"
                  icon={Repeat}
                  onClick={() => {
                    handleConvertToSubscription(selectedQuote);
                    setIsPreviewOpen(false);
                  }}
                >
                  Confirm & Convert to Subscription
                </Button>
              )}
            </div>
          }
        >
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 text-xs text-slate-800 print:border-none print:p-0">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">ValenceIQ Financial Systems</h3>
                <p className="text-slate-500 text-2xs mt-1">Enterprise Financial Analytics & Subscription Solutions</p>
                <p className="text-slate-400 text-2xs">Embassy TechVillage, Outer Ring Road, Bengaluru 560103</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-base text-blue-900 block">{selectedQuote.quotationNumber}</span>
                <Badge status={selectedQuote.status} className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xs font-semibold uppercase text-slate-400">Proposed For:</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedQuote.customerName}</p>
                <p className="text-slate-500 text-2xs mt-1">Payment Terms: {selectedQuote.paymentTerms}</p>
              </div>
              <div className="text-right">
                <p><span className="text-slate-400">Created Date:</span> {selectedQuote.createdDate}</p>
                <p><span className="text-slate-400">Valid Until:</span> <span className="font-semibold text-rose-600">{selectedQuote.validityDate}</span></p>
              </div>
            </div>

            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Item</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-right">Disc %</th>
                  <th className="p-2.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedQuote.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-medium">{item.productName}</td>
                    <td className="p-2.5 text-center">{item.quantity}</td>
                    <td className="p-2.5 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-2.5 text-right">{item.discountPercent || 0}%</td>
                    <td className="p-2.5 text-right font-semibold">{formatCurrency(item.subtotal || item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-60 space-y-1.5 border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedQuote.subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Total:</span>
                  <span>-{formatCurrency(selectedQuote.discountTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%):</span>
                  <span>{formatCurrency(selectedQuote.taxTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Final Total:</span>
                  <span>{formatCurrency(selectedQuote.finalTotal)}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-2xs text-slate-500">
              <p className="font-semibold text-slate-700">Terms & SLA:</p>
              <p>{selectedQuote.notes}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
