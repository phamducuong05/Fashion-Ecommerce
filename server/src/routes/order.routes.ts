import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/vnpay_return", orderController.vnpayReturn); // Callback doesnt need auth token from header usually

router.use(protect);
router.post("/", orderController.createOrder);

export default router;
