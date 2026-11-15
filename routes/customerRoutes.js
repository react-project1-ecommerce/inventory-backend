import express from "express";

import {
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Get all customers
router.get("/", getCustomers);

// Get a single customer
router.get("/:id", getCustomerById);

// Add a customer
router.post("/", addCustomer);

// Update a customer
router.put("/:id", updateCustomer);

// Delete a customer
router.delete("/:id", deleteCustomer);

export default router;
