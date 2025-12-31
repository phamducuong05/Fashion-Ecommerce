import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// Protect all routes
router.use(protect);

router.get("/profile", userController.getProfile);
router.patch("/profile", userController.updateProfile);
router.get("/orders", userController.getHistory);
router.get("/orders/:id", userController.getOrderDetails);

export default router;
