import { mockPlans } from "../data/mockData";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

class PlanService {
  constructor() {
    this.plans = [...mockPlans];
  }

  async getAll(params = {}) {
    await mockDelay();
    let result = [...this.plans];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      );
    }
    if (params.billingInterval && params.billingInterval !== "All") {
      result = result.filter((p) => p.billingInterval === params.billingInterval);
    }
    if (params.status && params.status !== "All") {
      result = result.filter((p) => p.status === params.status);
    }
    return createApiResponse(result);
  }

  async getById(id) {
    await mockDelay();
    const plan = this.plans.find((p) => p.id === id);
    if (!plan) throw createApiError("Plan not found", 404);
    return createApiResponse(plan);
  }

  async create(data) {
    await mockDelay();
    const newPlan = {
      id: `plan_${Date.now()}`,
      status: "Active",
      features: data.features || ["Standard Core Access", "Email Support"],
      ...data,
    };
    this.plans.unshift(newPlan);
    return createApiResponse(newPlan, "Subscription plan created successfully");
  }

  async update(id, data) {
    await mockDelay();
    const index = this.plans.findIndex((p) => p.id === id);
    if (index === -1) throw createApiError("Plan not found", 404);
    this.plans[index] = { ...this.plans[index], ...data };
    return createApiResponse(this.plans[index], "Plan updated successfully");
  }

  async delete(id) {
    await mockDelay();
    const index = this.plans.findIndex((p) => p.id === id);
    if (index === -1) throw createApiError("Plan not found", 404);
    const removed = this.plans.splice(index, 1)[0];
    return createApiResponse(removed, "Plan deleted successfully");
  }
}

export const planService = new PlanService();
