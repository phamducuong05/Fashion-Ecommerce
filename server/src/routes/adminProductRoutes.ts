// src/routes/adminProductRoutes.ts
import { Router } from "express";
import {
  getProducts,
  addProduct,
  editProduct,
  removeProduct,
} from "../controllers/adminProductController";

const router = Router();

// GET /api/admin/products - Get all products
router.get("/", getProducts);

// POST /api/admin/products - Create new product
router.post("/", addProduct);

// PUT /api/admin/products/:id - Update product
router.put("/:id", editProduct);

// DELETE /api/admin/products/:id - Delete product
router.delete("/:id", removeProduct);

export default router;
