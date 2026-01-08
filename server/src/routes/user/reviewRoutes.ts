import { Router } from "express";
import reviewController from "../../controllers/user/reviewController";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateToken, reviewController.create);

router.get("/:productId", reviewController.getByProduct);

export default router;
