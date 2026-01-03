import { Router } from "express";
import userController from "../../controllers/user/userController";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

// GET /api/users/profile
router.get("/profile", authenticateToken, userController.getProfile);
router.put("/profile", authenticateToken, userController.updateProfile);

export default router;
