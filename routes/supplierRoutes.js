import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
} from "../controllers/supplierController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getSuppliers);
router.get("/:id",getSupplierById)
router.post("/", addSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

export default router;