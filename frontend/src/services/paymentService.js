import { mockPayments } from "../data/mockData";
import { invoiceService } from "./invoiceService";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

class PaymentService {
  constructor() {
    this.payments = [...mockPayments];
  }

  async getAll(params = {}) {
    await mockDelay();
    let result = [...this.payments];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.paymentNumber.toLowerCase().includes(q) ||
          p.invoiceNumber.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q)
      );
    }
    if (params.method && params.method !== "All") {
      result = result.filter((p) => p.paymentMethod === params.method);
    }
    if (params.status && params.status !== "All") {
      result = result.filter((p) => p.status === params.status);
    }
    if (params.customerId) {
      result = result.filter((p) => p.customerId === params.customerId);
    }
    return createApiResponse(result);
  }

  async getById(id) {
    await mockDelay();
    const payment = this.payments.find((p) => p.id === id);
    if (!payment) throw createApiError("Payment record not found", 404);
    return createApiResponse(payment);
  }

  async recordPayment(data) {
    await mockDelay();
    const newPayment = {
      id: `pay_${Date.now()}`,
      paymentNumber: `PAY-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: data.status || "Successful",
      ...data,
    };

    this.payments.unshift(newPayment);

    // If successful, reconcile with invoice
    if (newPayment.status === "Successful" && newPayment.invoiceId) {
      try {
        await invoiceService.applyPayment(newPayment.invoiceId, newPayment.amount);
      } catch (err) {
        console.warn("Could not auto-reconcile invoice:", err.message);
      }
    }

    return createApiResponse(newPayment, "Payment recorded and reconciled successfully");
  }
}

export const paymentService = new PaymentService();
