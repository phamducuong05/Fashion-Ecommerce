import { Router } from "express";
import { getCategories } from "../controllers/categoryController";

const router = Router();

// GET /api/categories
router.get("/", getCategories);

export default router;
