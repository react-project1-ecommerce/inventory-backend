import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { askInventoryAssistant,getInventoryInsights } from "../controllers/aiController.js";

const router = express.Router();

//Creates an API route for the AI Assistant.
//Requires the user to be authenticated and email-verified.

router.post("/", authMiddleware, askInventoryAssistant);

router.post("/insights", authMiddleware, getInventoryInsights);

export default router;