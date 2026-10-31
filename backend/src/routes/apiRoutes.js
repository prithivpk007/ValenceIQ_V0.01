import express from "express";
import authRoutes from "./authRoutes.js";
import customerRoutes from "./customerRoutes.js";
import subscriptionRoutes from "./subscriptionRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import productRoutes from "./productRoutes.js";
import quotationRoutes from "./quotationRoutes.js";
import discountRoutes from "./discountRoutes.js";
import planRoutes from "./planRoutes.js";
import staffRoutes from "./staffRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import settingsRoutes from "./settingsRoutes.js";
import aiRoutes from "./aiRoutes.js";

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Brightloop SMS REST API",
    version: "2.0.0",
    phase: "Phase 2 — Full MongoDB Backend",
    timestamp: new Date().toISOString(),
  });
});

// Auth (public endpoints)
router.use("/auth", authRoutes);

// Resource routes (JWT-protected inside each router)
router.use("/customers", customerRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/payments", paymentRoutes);
router.use("/products", productRoutes);
router.use("/quotations", quotationRoutes);
router.use("/discounts", discountRoutes);
router.use("/plans", planRoutes);
router.use("/staff", staffRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/notifications", notificationRoutes);
router.use("/settings", settingsRoutes);
router.use("/ai", aiRoutes);

export default router;
