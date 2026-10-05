import Product from "../models/productModel.js";

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