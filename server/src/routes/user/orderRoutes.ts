import { Router } from "express";
import orderController from "../../controllers/user/orderController";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

// GET /api/orders/my-orders
router.get("/my-orders", authenticateToken, orderController.getMyOrders);
router.get("/:id", authenticateToken, orderController.getOrderDetail);

export default router;
