import express from "express";
import {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllPlans);
router.get("/:id", getPlanById);
router.post("/", authorize("admin"), createPlan);
router.put("/:id", authorize("admin"), updatePlan);
router.delete("/:id", authorize("admin"), deletePlan);

export default router;
