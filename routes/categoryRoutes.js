import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);  //endpoint /api/categories   create a category   
router.get("/", getCategories);    //endpoint /api/categories   get all categories

router.get("/:id",getCategoryById); //endpoint /api/categories/:id  get category by id

router.put("/:id", updateCategory);     //endpoint /api/categories/:id  update a category
router.delete("/:id", deleteCategory);  //endpoint /api/categories/:id  delete a category
  
export default router;