import { Router } from "express";
// Import chính xác tên hàm từ controller
import { getMyCart, addToCart } from "../controllers/cartController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Bảo vệ tất cả các route bên dưới
router.use(authenticate);

router.get("/", getMyCart); // GET /api/cart
router.post("/add", addToCart); // POST /api/cart/add

export default router;

