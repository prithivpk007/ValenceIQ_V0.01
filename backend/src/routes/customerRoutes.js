import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.post("/", authorize("admin", "staff"), createCustomer);
router.put("/:id", authorize("admin", "staff"), updateCustomer);
router.delete("/:id", authorize("admin"), deleteCustomer);

export default router;
