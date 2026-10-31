import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getSettings);
router.put("/:category", authenticate, authorize("admin"), updateSettings);

export default router;
