import express from "express";
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  applyPaymentToInvoice,
} from "../controllers/invoiceController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.post("/", authorize("admin", "staff"), createInvoice);
router.put("/:id/status", authorize("admin", "staff"), updateInvoiceStatus);
router.post("/:id/payment", authorize("admin", "staff"), applyPaymentToInvoice);

export default router;
