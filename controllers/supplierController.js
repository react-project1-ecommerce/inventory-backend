import Supplier from "../models/supplierModel.js";

// Get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 }); //sort by descending order 
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single supplier
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found.",
      });
    }

    res.status(200).json(supplier);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add a supplier
export const addSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a supplier
export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    res.status(200).json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a supplier
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    res.status(200).json({ message: "Supplier deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};