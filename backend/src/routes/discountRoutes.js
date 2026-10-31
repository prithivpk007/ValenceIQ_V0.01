import express from "express";
import {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  toggleDiscountStatus,
  deleteDiscount,
} from "../controllers/discountController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllDiscounts);
router.post("/", authorize("admin"), createDiscount);
router.put("/:id", authorize("admin"), updateDiscount);
router.patch("/:id/toggle", authorize("admin"), toggleDiscountStatus);
router.delete("/:id", authorize("admin"), deleteDiscount);

export default router;
