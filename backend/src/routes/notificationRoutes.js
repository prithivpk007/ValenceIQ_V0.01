import express from "express";
import {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
} from "../controllers/notificationController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllNotifications);
router.patch("/mark-all-read", markAllAsRead);
router.delete("/clear", clearAllNotifications);
router.patch("/:id/read", markAsRead);

export default router;
