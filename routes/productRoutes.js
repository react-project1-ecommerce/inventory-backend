import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
} from "../controllers/productController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

//The middleware will then run before all five product routes (POST, GET, GET by ID, PUT, and DELETE).

router.use(authMiddleware);  //product API requests remain protected.

//connects each URL to the appropriate controller function

router.post("/", createProduct);

router.post("/stock", updateStock);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;