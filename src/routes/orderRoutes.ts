import { Router } from "express";
import { createOrder } from "../controllers/orderController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticate); // Bảo vệ tất cả route

router.post("/checkout", createOrder); // POST /api/orders/checkout

export default router;
