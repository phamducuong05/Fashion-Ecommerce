// src/routes/productRoutes.ts
import { Router } from "express";
import {
  getProducts,
  getProductDetail,
} from "../controllers/productController";

const router = Router();

// Định nghĩa: GET /api/products/
router.get("/", getProducts);

router.get("/:id", getProductDetail);

export default router;
