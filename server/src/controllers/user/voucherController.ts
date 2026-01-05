import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import voucherService from "../../services/user/voucherService";

const getMyVouchers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const vouchers = await voucherService.getMyVouchers(userId);
    res.json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy danh sách voucher" });
  }
};

export default { getMyVouchers };
