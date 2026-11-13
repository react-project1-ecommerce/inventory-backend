
import express from "express";

import {
  createPurchase,
  getPurchases,
  updatePurchaseStatus,
} from "../controllers/purchaseController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getPurchases);                  //endpoint /api/purchases
router.post("/", createPurchase);               //endpoint /api/purchases
router.put("/:id/status", updatePurchaseStatus);  //endpoint /api/purchases/:id/status

export default router;
