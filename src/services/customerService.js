import { mockCustomers } from "../data/mockData";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

class CustomerService {
  constructor() {
    this.customers = [...mockCustomers];
  }

  async getAll(params = {}) {
    await mockDelay();
    let result = [...this.customers];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.contactPerson.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== "All") {
      result = result.filter((c) => c.status === params.status);
    }
    return createApiResponse(result);
  }

  async getById(id) {
    await mockDelay();
    const customer = this.customers.find((c) => c.id === id);
    if (!customer) {
      throw createApiError("Customer not found", 404);
    }
    return createApiResponse(customer);
  }

  async create(data) {
    await mockDelay();
    const newCustomer = {
      id: `cust_${Date.now()}`,
      createdDate: new Date().toISOString().split("T")[0],
      totalSpent: 0,
      activeSubscriptionsCount: 0,
      status: "Active",
      currency: "INR",
      assignedStaff: data.assignedStaff || "Priya Sharma",
      ...data,
    };
    this.customers.unshift(newCustomer);
    return createApiResponse(newCustomer, "Customer created successfully");
  }

  async update(id, data) {
    await mockDelay();
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) throw createApiError("Customer not found", 404);
    this.customers[index] = { ...this.customers[index], ...data };
    return createApiResponse(this.customers[index], "Customer updated successfully");
  }

  async delete(id) {
    await mockDelay();
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) throw createApiError("Customer not found", 404);
    const removed = this.customers.splice(index, 1)[0];
    return createApiResponse(removed, "Customer deleted successfully");
  }
}

export const customerService = new CustomerService();
