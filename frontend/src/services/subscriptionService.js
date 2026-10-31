import { mockSubscriptions } from "../data/mockData";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

class SubscriptionService {
  constructor() {
    this.subscriptions = [...mockSubscriptions];
  }

  async getAll(params = {}) {
    await mockDelay();
    let result = [...this.subscriptions];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (sub) =>
          sub.subscriptionNumber.toLowerCase().includes(q) ||
          sub.customerName.toLowerCase().includes(q) ||
          sub.planName.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== "All") {
      result = result.filter((sub) => sub.status === params.status);
    }
    if (params.customerId) {
      result = result.filter((sub) => sub.customerId === params.customerId);
    }
    return createApiResponse(result);
  }

  async getById(id) {
    await mockDelay();
    const subscription = this.subscriptions.find((s) => s.id === id);
    if (!subscription) throw createApiError("Subscription not found", 404);
    return createApiResponse(subscription);
  }

  async create(data) {
    await mockDelay();
    const newSub = {
      id: `sub_${Date.now()}`,
      subscriptionNumber: `SUB-BL-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Active",
      autoRenew: true,
      timeline: [
        {
          date: new Date().toISOString().split("T")[0],
          event: "Subscription initialized in the system",
        },
      ],
      ...data,
    };
    this.subscriptions.unshift(newSub);
    return createApiResponse(newSub, "Subscription created successfully");
  }

  async updateStatus(id, newStatus, reason = "") {
    await mockDelay();
    const index = this.subscriptions.findIndex((s) => s.id === id);
    if (index === -1) throw createApiError("Subscription not found", 404);

    const sub = this.subscriptions[index];
    const prevStatus = sub.status;

    // Validate lifecycle transitions
    if (prevStatus === "Closed" && newStatus !== "Closed") {
      throw createApiError("A closed subscription cannot be directly re-opened. Please create a new subscription.", 400);
    }

    sub.status = newStatus;
    sub.timeline.push({
      date: new Date().toISOString().split("T")[0],
      event: `Status transitioned from ${prevStatus} to ${newStatus}${reason ? `: ${reason}` : ""}`,
    });

    return createApiResponse(sub, `Subscription is now ${newStatus}`);
  }

  async renew(id) {
    await mockDelay();
    const index = this.subscriptions.findIndex((s) => s.id === id);
    if (index === -1) throw createApiError("Subscription not found", 404);

    const sub = this.subscriptions[index];
    const currentExpiry = new Date(sub.expiryDate);
    // Add 1 month or 1 year
    const nextExpiry = new Date(currentExpiry);
    if (sub.billingInterval === "Yearly") {
      nextExpiry.setFullYear(nextExpiry.getFullYear() + 1);
    } else {
      nextExpiry.setMonth(nextExpiry.getMonth() + 1);
    }

    sub.expiryDate = nextExpiry.toISOString().split("T")[0];
    sub.status = "Active";
    sub.timeline.push({
      date: new Date().toISOString().split("T")[0],
      event: `Subscription renewed successfully through ${sub.expiryDate}`,
    });

    return createApiResponse(sub, "Subscription successfully renewed");
  }

  async createFromQuotation(quotation) {
    await mockDelay();
    const newSub = {
      id: `sub_${Date.now()}`,
      subscriptionNumber: `SUB-BL-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: quotation.customerId,
      customerName: quotation.customerName,
      planId: quotation.items[0]?.productId || "plan_custom",
      planName: quotation.items[0]?.productName || "Custom Contract Package",
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      billingInterval: "Monthly",
      paymentTerms: quotation.paymentTerms || "Net 15",
      subscriptionValue: quotation.finalTotal,
      status: "Active",
      autoRenew: true,
      timeline: [
        {
          date: new Date().toISOString().split("T")[0],
          event: `Generated automatically upon conversion of Quotation ${quotation.quotationNumber}`,
        },
      ],
    };
    this.subscriptions.unshift(newSub);
    return createApiResponse(newSub, "Quotation successfully converted to Active Subscription!");
  }
}

export const subscriptionService = new SubscriptionService();
