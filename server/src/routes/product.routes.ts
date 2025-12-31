import { Router } from "express";
import * as productController from "../controllers/product.controller";
import * as reviewController from "../controllers/review.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductDetail);

// Review Routes
router.get("/:id/reviews", reviewController.getReviews);
router.post("/:id/reviews", protect, reviewController.createReview);

export default router;
