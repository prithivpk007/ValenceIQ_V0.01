import { mockAnalyticsData } from "../data/mockData";
import { mockDelay, createApiResponse } from "./apiClient";

class AnalyticsService {
  async getDashboardKpis(filters = {}) {
    await mockDelay(100);
    // In Phase 1 mock dataset, return consistent deterministic metrics
    return createApiResponse(mockAnalyticsData.kpis);
  }

  async getMrrTrend(period = "6M") {
    await mockDelay(100);
    return createApiResponse(mockAnalyticsData.mrrTrend);
  }

  async getRevenueByPlan() {
    await mockDelay(100);
    return createApiResponse(mockAnalyticsData.revenueByPlan);
  }

  async getInvoiceStatusDistribution() {
    await mockDelay(100);
    return createApiResponse(mockAnalyticsData.invoiceStatusDistribution);
  }

  async getSubscriptionGrowth() {
    await mockDelay(100);
    return createApiResponse(mockAnalyticsData.subscriptionGrowth);
  }

  async getInvoiceAging() {
    await mockDelay(100);
    return createApiResponse(mockAnalyticsData.invoiceAging);
  }
}

export const analyticsService = new AnalyticsService();
