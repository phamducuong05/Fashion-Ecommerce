import { Router } from "express";
import { getProducts, getProductDetail } from "../../controllers/user/productController";

const router = Router();

// GET /api/products/
router.get("/", getProducts);

// GET /api/products/:id
router.get("/:id", getProductDetail);

export default router;
