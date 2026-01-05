import { Router } from "express";
import voucherController from "../../controllers/user/voucherController";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

// GET /api/vouchers/my-vouchers
router.get("/my-vouchers", authenticateToken, voucherController.getMyVouchers);

export default router;
