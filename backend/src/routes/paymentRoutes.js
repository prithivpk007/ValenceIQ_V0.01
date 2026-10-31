import express from "express";
import {
  getAllPayments,
  getPaymentById,
  recordPayment,
} from "../controllers/paymentController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.post("/", authorize("admin", "staff"), recordPayment);

export default router;
