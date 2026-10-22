
import mongoose from "mongoose";

const stockHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    movementType: {
      type: String,
      enum: ["in", "out"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    previousQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    newQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const StockHistory = mongoose.model(
  "StockHistory",
  stockHistorySchema
);

export default StockHistory;
