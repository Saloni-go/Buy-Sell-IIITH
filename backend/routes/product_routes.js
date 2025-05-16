import express from 'express';
import { createProducts, getProducts, deleteProducts, updateProducts, getAproduct } from "../controllers/product.controller.js"
const router = express.Router();

router.post("/", createProducts); // Create a new product
router.get("/", getProducts); // Get all products
router.delete("/:id", deleteProducts); // Delete a product by ID
router.put("/:id", updateProducts); // Update a product by ID
router.get("/:id",getAproduct); //get a single product based on ID
export default router;
