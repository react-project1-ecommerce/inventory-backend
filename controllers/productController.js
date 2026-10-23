import Product from "../models/productModel.js";
import StockHistory from "../models/stockHistoryModel.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      quantity,
      price,
      supplier,
      department,
      description,
    } = req.body;

    const productExists = await Product.findOne({ sku });  

    if (productExists) {
      return res.status(400).json({
        message: "Product with this SKU already exists",
      });
    }

    const product = await Product.create({
      name,
      sku,
      category,
      quantity,
      price,
      supplier,
      department,
      description,
    });

    res.status(201).json(product);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
    
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
                           .populate("category")  // converting the reference in the productModel into a category document
                           .sort({createdAt:-1});

    res.status(200).json(products);
  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
                          .populate("category");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


 // Record Stock In / Stock Out

export const updateStock = async (req, res) => {
  try {
    const { productId, movementType, quantity, reason } = req.body;

    const stockQuantity = Number(quantity);

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be a positive whole number",
      });
    }

    if (!["in", "out"].includes(movementType)) {
      return res.status(400).json({
        message: "Invalid stock movement type",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "Reason is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const previousQuantity = product.quantity;
    let newQuantity;

    if (movementType === "in") {
      newQuantity = previousQuantity + stockQuantity;
    } else {
      if (previousQuantity < stockQuantity) {
        return res.status(400).json({
          message: "Insufficient stock available",
        });
      }

      newQuantity = previousQuantity - stockQuantity;
    }

    product.quantity = newQuantity;
    await product.save();

    await StockHistory.create({
      product: product._id,
      movementType,
      quantity: stockQuantity,
      previousQuantity,
      newQuantity,
      reason: reason.trim(),
    });

    res.status(200).json({
      message: "Stock updated and history recorded successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getStockHistory = async (req, res) => {

  try {
    const history = await StockHistory.find()
      .populate("product", "name sku")
      .sort({ createdAt: -1 });

    res.status(200).json(history);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
    
  }
};
