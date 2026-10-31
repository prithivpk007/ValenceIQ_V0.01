import { mockStaffMembers } from "../data/mockData";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

class StaffService {
  constructor() {
    this.staff = [...mockStaffMembers];
  }

  async getAll(params = {}) {
    await mockDelay();
    let result = [...this.staff];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      );
    }
    if (params.department && params.department !== "All") {
      result = result.filter((s) => s.department === params.department);
    }
    return createApiResponse(result);
  }

  async create(data) {
    await mockDelay();
    const newStaff = {
      id: `stf_${Date.now()}`,
      assignedCustomersCount: 0,
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
      ...data,
    };
    this.staff.unshift(newStaff);
    return createApiResponse(newStaff, "Staff member created successfully");
  }

  async update(id, data) {
    await mockDelay();
    const index = this.staff.findIndex((s) => s.id === id);
    if (index === -1) throw createApiError("Staff member not found", 404);
    this.staff[index] = { ...this.staff[index], ...data };
    return createApiResponse(this.staff[index], "Staff member updated successfully");
  }

  async delete(id) {
    await mockDelay();
    const index = this.staff.findIndex((s) => s.id === id);
    if (index === -1) throw createApiError("Staff not found", 404);
    const removed = this.staff.splice(index, 1)[0];
    return createApiResponse(removed, "Staff member removed");
  }
}

export const staffService = new StaffService();
