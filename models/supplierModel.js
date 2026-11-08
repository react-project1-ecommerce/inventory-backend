import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    streetAddress: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pinCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: "India",
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;