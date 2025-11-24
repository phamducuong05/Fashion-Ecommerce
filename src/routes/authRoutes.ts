import { Router } from "express";
import { register, login } from "../controllers/authController";
import { authenticate, AuthRequest } from "../middlewares/authMiddleware";

const router = Router();

// Định nghĩa các đường dẫn
router.post("/register", register); // POST /api/auth/register
router.post("/login", login); // POST /api/auth/login

router.get("/profile", authenticate, (req: AuthRequest, res) => {
  res.json({
    message: "Đây là thông tin mật",
    user: req.user, // Thông tin lấy từ token
  });
});

export default router;
