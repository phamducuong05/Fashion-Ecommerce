// src/routes/adminDiscountRoutes.ts
import { Router } from "express";
import {
  getDiscounts,
  addDiscount,
  editDiscount,
  removeDiscount,
} from "../controllers/adminDiscountController";

const router = Router();

// GET /api/admin/discounts - Get all discounts
router.get("/", getDiscounts);

// POST /api/admin/discounts - Create new discount
router.post("/", addDiscount);

// PUT /api/admin/discounts/:id - Update discount
router.put("/:id", editDiscount);

// DELETE /api/admin/discounts/:id - Delete discount
router.delete("/:id", removeDiscount);

export default router;
