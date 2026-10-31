import express from "express";
import { register, login, logout, getMe, getAllUsers } from "../controllers/authController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.get("/users", authenticate, authorize("admin"), getAllUsers);

export default router;
