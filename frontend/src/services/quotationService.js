import { mockQuotations } from "../data/mockData";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

class QuotationService {
  constructor() {
    this.quotations = [...mockQuotations];
  }

  async getAll(params = {}) {
    await mockDelay();
    let result = [...this.quotations];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (quo) =>
          quo.quotationNumber.toLowerCase().includes(q) ||
          quo.customerName.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== "All") {
      result = result.filter((quo) => quo.status === params.status);
    }
    if (params.customerId) {
      result = result.filter((quo) => quo.customerId === params.customerId);
    }
    return createApiResponse(result);
  }

  async getById(id) {
    await mockDelay();
    const quotation = this.quotations.find((q) => q.id === id);
    if (!quotation) throw createApiError("Quotation not found", 404);
    return createApiResponse(quotation);
  }

  async create(data) {
    await mockDelay();
    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const discountTotal = data.items.reduce((acc, item) => acc + ((item.quantity * item.unitPrice) * ((item.discountPercent || 0) / 100)), 0);
    const taxable = subtotal - discountTotal;
    const taxTotal = taxable * 0.18; // Standard 18% GST
    const finalTotal = taxable + taxTotal;

    const newQuotation = {
      id: `quot_${Date.now()}`,
      quotationNumber: `QUO-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      createdDate: new Date().toISOString().split("T")[0],
      status: data.status || "Draft",
      template: data.template || "Standard SaaS Agreement",
      subtotal,
      discountTotal,
      taxTotal,
      finalTotal,
      ...data,
    };
    this.quotations.unshift(newQuotation);
    return createApiResponse(newQuotation, "Quotation created successfully");
  }

  async update(id, data) {
    await mockDelay();
    const index = this.quotations.findIndex((q) => q.id === id);
    if (index === -1) throw createApiError("Quotation not found", 404);
    this.quotations[index] = { ...this.quotations[index], ...data };
    return createApiResponse(this.quotations[index], "Quotation updated successfully");
  }

  async updateStatus(id, newStatus) {
    await mockDelay();
    const index = this.quotations.findIndex((q) => q.id === id);
    if (index === -1) throw createApiError("Quotation not found", 404);

    const quotation = this.quotations[index];
    const today = new Date().toISOString().split("T")[0];

    // Check validity
    if (newStatus === "Confirmed" && quotation.validityDate < today) {
      throw createApiError(
        "Cannot confirm an expired quotation. Please extend validity date or re-issue pricing.",
        400
      );
    }

    quotation.status = newStatus;
    return createApiResponse(quotation, `Quotation status updated to ${newStatus}`);
  }

  async delete(id) {
    await mockDelay();
    const index = this.quotations.findIndex((q) => q.id === id);
    if (index === -1) throw createApiError("Quotation not found", 404);
    const removed = this.quotations.splice(index, 1)[0];
    return createApiResponse(removed, "Quotation deleted successfully");
  }
}

export const quotationService = new QuotationService();
