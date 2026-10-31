import { mockInvoices } from "../data/mockData";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

class InvoiceService {
  constructor() {
    this.invoices = [...mockInvoices];
  }

  async getAll(params = {}) {
    await mockDelay();
    let result = [...this.invoices];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.customerName.toLowerCase().includes(q) ||
          (inv.subscriptionName && inv.subscriptionName.toLowerCase().includes(q))
      );
    }
    if (params.status && params.status !== "All") {
      result = result.filter((inv) => inv.status === params.status);
    }
    if (params.customerId) {
      result = result.filter((inv) => inv.customerId === params.customerId);
    }
    return createApiResponse(result);
  }

  async getById(id) {
    await mockDelay();
    const invoice = this.invoices.find((inv) => inv.id === id);
    if (!invoice) throw createApiError("Invoice not found", 404);
    return createApiResponse(invoice);
  }

  async create(data) {
    await mockDelay();
    const subtotal = Number(data.subtotal || 0);
    const discountAmount = Number(data.discountAmount || 0);
    const taxRate = Number(data.taxRate || 18);
    const taxable = subtotal - discountAmount;
    const taxAmount = (taxable * taxRate) / 100;
    const total = taxable + taxAmount;

    const newInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      invoiceDate: data.invoiceDate || new Date().toISOString().split("T")[0],
      dueDate: data.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
      subtotal,
      discountAmount,
      taxRate,
      taxAmount,
      total,
      amountPaid: 0,
      balanceDue: total,
      status: data.status || "Confirmed",
      items: data.items || [],
      notes: data.notes || "Standard corporate recurring invoice.",
      ...data,
    };

    this.invoices.unshift(newInvoice);
    return createApiResponse(newInvoice, "Invoice generated successfully");
  }

  async applyPayment(invoiceId, paymentAmount) {
    await mockDelay();
    const index = this.invoices.findIndex((inv) => inv.id === invoiceId);
    if (index === -1) throw createApiError("Invoice not found", 404);

    const inv = this.invoices[index];
    const newPaid = Number(inv.amountPaid) + Number(paymentAmount);
    const newBalance = Math.max(0, Number(inv.total) - newPaid);

    inv.amountPaid = newPaid;
    inv.balanceDue = newBalance;

    if (newBalance === 0) {
      inv.status = "Paid";
    } else {
      inv.status = "Partially Paid";
    }

    return createApiResponse(inv, `Payment of ₹${paymentAmount} applied to ${inv.invoiceNumber}`);
  }

  async updateStatus(id, newStatus) {
    await mockDelay();
    const index = this.invoices.findIndex((inv) => inv.id === id);
    if (index === -1) throw createApiError("Invoice not found", 404);
    this.invoices[index].status = newStatus;
    return createApiResponse(this.invoices[index], `Invoice marked as ${newStatus}`);
  }
}

export const invoiceService = new InvoiceService();
