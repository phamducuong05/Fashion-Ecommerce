import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect); // All cart routes require login

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.patch("/:id", cartController.updateCartItem);
router.delete("/:id", cartController.removeFromCart);

export default router;
