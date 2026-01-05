import { Router } from "express";
import { getCategories } from "../../controllers/user/categoryController";

const router = Router();

// GET /api/categories
router.get("/", getCategories);

export default router;
