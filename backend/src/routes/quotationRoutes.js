import express from "express";
import {
  getAllQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation,
} from "../controllers/quotationController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllQuotations);
router.get("/:id", getQuotationById);
router.post("/", authorize("admin", "staff"), createQuotation);
router.put("/:id", authorize("admin", "staff"), updateQuotation);
router.put("/:id/status", authorize("admin", "staff"), updateQuotationStatus);
router.delete("/:id", authorize("admin"), deleteQuotation);

export default router;
