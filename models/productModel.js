import mongoose from "mongoose";

// This model tells MongoDB what a Product should look like

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,    //no two products should have the same stock keeping unit
    },

category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: true,
},

    quantity: {
      type: Number,
      required: true,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    supplier: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;