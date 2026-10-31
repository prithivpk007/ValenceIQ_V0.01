import { mockProducts } from "../data/mockData";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

class ProductService {
  constructor() {
    this.products = [...mockProducts];
  }

  async getAll(params = {}) {
    await mockDelay();
    let result = [...this.products];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== "All") {
      result = result.filter((p) => p.status === params.status);
    }
    if (params.category && params.category !== "All") {
      result = result.filter((p) => p.category === params.category);
    }
    return createApiResponse(result);
  }

  async getById(id) {
    await mockDelay();
    const product = this.products.find((p) => p.id === id);
    if (!product) throw createApiError("Product not found", 404);
    return createApiResponse(product);
  }

  async create(data) {
    await mockDelay();
    const newProduct = {
      id: `prod_${Date.now()}`,
      status: "Active",
      variants: data.variants || [],
      ...data,
    };
    this.products.unshift(newProduct);
    return createApiResponse(newProduct, "Product created successfully");
  }

  async update(id, data) {
    await mockDelay();
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw createApiError("Product not found", 404);
    this.products[index] = { ...this.products[index], ...data };
    return createApiResponse(this.products[index], "Product updated successfully");
  }

  async delete(id) {
    await mockDelay();
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw createApiError("Product not found", 404);
    const removed = this.products.splice(index, 1)[0];
    return createApiResponse(removed, "Product deleted successfully");
  }
}

export const productService = new ProductService();
