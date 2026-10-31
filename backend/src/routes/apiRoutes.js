import express from "express";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Brightloop SMS REST API",
    phase: "Phase 2 Backend Architecture",
    timestamp: new Date().toISOString(),
  });
});

// Products endpoint stub
router.get("/products", (req, res) => {
  res.json({
    success: true,
    data: [],
    message: "Products fetched successfully",
  });
});

// Subscriptions endpoint stub
router.get("/subscriptions", (req, res) => {
  res.json({
    success: true,
    data: [],
    message: "Subscriptions fetched successfully",
  });
});

// Invoices endpoint stub
router.get("/invoices", (req, res) => {
  res.json({
    success: true,
    data: [],
    message: "Invoices fetched successfully",
  });
});

// Customers endpoint stub
router.get("/customers", (req, res) => {
  res.json({
    success: true,
    data: [],
    message: "Customers fetched successfully",
  });
});

export default router;
