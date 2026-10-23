import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  getStockHistory,
} from "../controllers/productController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

//The middleware will then run before all five product routes (POST, GET, GET by ID, PUT, and DELETE).

router.use(authMiddleware);  //product API requests remain protected.

//connects each URL to the appropriate controller function

router.post("/", createProduct);

router.post("/stock", updateStock);

//This route appears before the router.get("/:id", getProductById) route.Because Express could interpret stock-history as a product ID


router.get("/stock-history", getStockHistory);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;