import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import orderService from "../services/order.service";

const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await orderService.getMyOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng" });
  }
};

export default { getMyOrders };
