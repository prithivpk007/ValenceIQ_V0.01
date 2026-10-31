import { mockDiscounts } from "../data/mockData";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

class DiscountService {
  constructor() {
    this.discounts = [...mockDiscounts];
  }

  async getAll(params = {}) {
    await mockDelay();
    let result = [...this.discounts];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (d) => d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
      );
    }
    if (params.type && params.type !== "All") {
      result = result.filter((d) => d.type === params.type);
    }
    if (params.status && params.status !== "All") {
      result = result.filter((d) => d.status === params.status);
    }
    return createApiResponse(result);
  }

  async create(data) {
    await mockDelay();
    const newDiscount = {
      id: `disc_${Date.now()}`,
      usageCount: 0,
      status: "Active",
      ...data,
      code: data.code.toUpperCase().trim(),
    };
    this.discounts.unshift(newDiscount);
    return createApiResponse(newDiscount, "Discount rule created successfully");
  }

  async update(id, data) {
    await mockDelay();
    const index = this.discounts.findIndex((d) => d.id === id);
    if (index === -1) throw createApiError("Discount rule not found", 404);
    this.discounts[index] = { ...this.discounts[index], ...data };
    return createApiResponse(this.discounts[index], "Discount updated successfully");
  }

  async toggleStatus(id) {
    await mockDelay();
    const index = this.discounts.findIndex((d) => d.id === id);
    if (index === -1) throw createApiError("Discount rule not found", 404);
    const curr = this.discounts[index].status;
    this.discounts[index].status = curr === "Active" ? "Inactive" : "Active";
    return createApiResponse(
      this.discounts[index],
      `Discount ${this.discounts[index].code} marked as ${this.discounts[index].status}`
    );
  }

  async delete(id) {
    await mockDelay();
    const index = this.discounts.findIndex((d) => d.id === id);
    if (index === -1) throw createApiError("Discount not found", 404);
    const removed = this.discounts.splice(index, 1)[0];
    return createApiResponse(removed, "Discount deleted successfully");
  }
}

export const discountService = new DiscountService();
