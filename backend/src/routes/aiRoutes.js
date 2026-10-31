import express from "express";
import { askQuestion, getSuggestedQuestions } from "../controllers/aiController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/ask", askQuestion);
router.get("/suggestions", getSuggestedQuestions);

export default router;
