import express from "express";
import {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscriptionStatus,
  renewSubscription,
  createFromQuotation,
} from "../controllers/subscriptionController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllSubscriptions);
router.get("/:id", getSubscriptionById);
router.post("/", authorize("admin", "staff"), createSubscription);
router.post("/from-quotation", authorize("admin", "staff"), createFromQuotation);
router.put("/:id/status", authorize("admin", "staff"), updateSubscriptionStatus);
router.post("/:id/renew", authorize("admin", "staff"), renewSubscription);

export default router;
