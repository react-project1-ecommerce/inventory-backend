
import mongoose from "mongoose";

import Sale from "../models/saleModel.js";
import Customer from "../models/customerModel.js";
import Product from "../models/productModel.js";
import StockHistory from "../models/stockHistoryModel.js";

// Create Sale – save sale, reduce stock and create stock history.

export const createSale = async (req, res) => {
  try {
    const { customer, products } = req.body;

    if (!customer) {
      return res.status(400).json({
        message: "Customer is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(customer)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "At least one product is required",
      });
    }

    const customerExists = await Customer.findById(customer);

    if (!customerExists) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    let totalAmount = 0;
    const saleProducts = [];

    // Validate all products before changing stock.
    for (const item of products) {
      const { product, quantity, sellingPrice } = item;

      const saleQuantity = Number(quantity);
      const price = Number(sellingPrice);

      if (!mongoose.Types.ObjectId.isValid(product)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      if (!Number.isInteger(saleQuantity) || saleQuantity <= 0) {
        return res.status(400).json({
          message: "Quantity must be a positive whole number",
        });
      }

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          message: "Selling price must be a valid non-negative number",
        });
      }

      const productExists = await Product.findById(product);

      if (!productExists) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const subtotal = saleQuantity * price;
      totalAmount += subtotal;

      saleProducts.push({
        product,
        quantity: saleQuantity,
        sellingPrice: price,
        subtotal,
      });
    }

    // Start MongoDB transaction.
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {

        // Reduce product stock.
        for (const item of saleProducts) {
          const product = await Product.findById(item.product).session(
            session
          );

          if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
          }

          if (product.quantity < item.quantity) {
            const error = new Error(
              `Insufficient stock for ${product.name}. Available stock: ${product.quantity}`
            );
            error.statusCode = 400;
            throw error;
          }

          const previousQuantity = product.quantity;
          const newQuantity = previousQuantity - item.quantity;

          product.quantity = newQuantity;

          await product.save({ session });

          // Create Stock History.
          await StockHistory.create(
            [
              {
                product: product._id,
                movementType: "out",
                quantity: item.quantity,
                previousQuantity,
                newQuantity,
                reason: "Customer sale",
              },
            ],
            { session }
          );
        }

        // Save sale.
        const createdSales = await Sale.create(
          [
            {
              customer,
              products: saleProducts,
              totalAmount,
            },
          ],
          { session }
        );

        // Store sale ID for response.
        saleProducts.createdSaleId = createdSales[0]._id;
      });

      const sale = await Sale.findById(saleProducts.createdSaleId)
        .populate("customer")
        .populate("products.product");

      res.status(201).json({
        message: "Sale created successfully",
        sale,
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


// Get All Sales – retrieve sales history.

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customer")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json(sales);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
