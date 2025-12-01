// src/routes/adminOrderRoutes.ts
import { Router } from "express";
import { getOrders, editOrderStatus } from "../controllers/adminOrderController";

const router = Router();

// GET /api/admin/orders - Get all orders
router.get("/", getOrders);

// PUT /api/admin/orders/:id - Update order status
router.put("/:id", editOrderStatus);

export default router;
