import express from "express";
import {
  getDashboardKpis,
  getMrrTrend,
  getRevenueByPlan,
  getInvoiceStatusDistribution,
  getSubscriptionGrowth,
  getInvoiceAging,
} from "../controllers/analyticsController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/kpis", getDashboardKpis);
router.get("/mrr-trend", getMrrTrend);
router.get("/revenue-by-plan", getRevenueByPlan);
router.get("/invoice-status", getInvoiceStatusDistribution);
router.get("/subscription-growth", getSubscriptionGrowth);
router.get("/invoice-aging", getInvoiceAging);

export default router;
