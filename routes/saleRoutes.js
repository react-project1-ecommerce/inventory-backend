import express from "express";
import {
  getSales,
  createSale,
} from "../controllers/saleController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getSales);
router.post("/", createSale);

export default router;