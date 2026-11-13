import mongoose from "mongoose";

import Purchase from "../models/purchaseModel.js";
import Supplier from "../models/supplierModel.js";
import Product from "../models/productModel.js";
import StockHistory from "../models/stockHistoryModel.js";

// Create Purchase – save a new purchase with Pending status, without increasing stock.

export const createPurchase = async (req, res) => {
  try {
    const { supplier, products } = req.body;

    if (!supplier) {
      return res.status(400).json({
        message: "Supplier is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(supplier)) {
      return res.status(400).json({
        message: "Invalid supplier ID",
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "At least one product is required",
      });
    }

    const supplierExists = await Supplier.findById(supplier);

    if (!supplierExists) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    let totalAmount = 0;
    const purchaseProducts = [];

    for (const item of products) {
      const { product, quantity, purchasePrice } = item;

      const stockQuantity = Number(quantity);
      const price = Number(purchasePrice);

      if (!mongoose.Types.ObjectId.isValid(product)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      if (!Number.isInteger(stockQuantity) || stockQuantity <= 0) {
        return res.status(400).json({
          message: "Quantity must be a positive whole number",
        });
      }

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          message: "Purchase price must be a valid non-negative number",
        });
      }

      const productExists = await Product.findById(product);

      if (!productExists) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const subtotal = stockQuantity * price;
      totalAmount += subtotal;

      purchaseProducts.push({
        product,
        quantity: stockQuantity,
        purchasePrice: price,
        subtotal,
      });
    }

    const purchase = await Purchase.create({
      supplier,
      products: purchaseProducts,
      totalAmount,
    });

    await purchase.populate("supplier");
    await purchase.populate("products.product");

    res.status(201).json({
      message: "Purchase created successfully",
      purchase,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get All Purchases – retrieve purchase history

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json(purchases);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Mark Purchase as Received or Cancelled – handle both (Mark as Received) and (Cancel Purchase)

export const updatePurchaseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const purchaseId = req.params.id;

    if (!["Received", "Cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid purchase status",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
      return res.status(400).json({
        message: "Invalid purchase ID",
      });
    }

    // Cancel Purchase
    if (status === "Cancelled") {
      const purchase = await Purchase.findOneAndUpdate(
        {
          _id: purchaseId,
          status: "Pending",
        },
        {
          $set: { status: "Cancelled" },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!purchase) {
        const existingPurchase = await Purchase.findById(purchaseId);

        if (!existingPurchase) {
          return res.status(404).json({
            message: "Purchase not found",
          });
        }

        return res.status(400).json({
          message: "Only pending purchases can be cancelled",
        });
      }

      return res.status(200).json({
        message: "Purchase cancelled successfully",
        purchase,
      });
    }

    // Mark Purchase as Received
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const purchase = await Purchase.findOne({
          _id: purchaseId,
          status: "Pending",
        }).session(session);

        if (!purchase) {
          const error = new Error(
            "Purchase not found or is no longer pending"
          );
          error.statusCode = 400;
          throw error;
        }

        for (const item of purchase.products) {
          const product = await Product.findById(item.product).session(
            session
          );

          if (!product) {
            const error = new Error(
              "A product in this purchase could not be found"
            );
            error.statusCode = 404;
            throw error;
          }

          const previousQuantity = product.quantity;
          const newQuantity = previousQuantity + item.quantity;

          product.quantity = newQuantity;

          await product.save({ session });

          await StockHistory.create(
            [
              {
                product: product._id,
                movementType: "in",
                quantity: item.quantity,
                previousQuantity,
                newQuantity,
                reason: "Supplier delivery",
              },
            ],
            { session }
          );
        }

        purchase.status = "Received";

        await purchase.save({ session });
      });

      const updatedPurchase = await Purchase.findById(purchaseId)
        .populate("supplier")
        .populate("products.product");

      res.status(200).json({
        message: "Purchase received and stock updated successfully",
        purchase: updatedPurchase,
      });

    } finally {
      await session.endSession();
    }

  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};
