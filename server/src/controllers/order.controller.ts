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

const getOrderDetail = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const orderId = Number(req.params.id);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (isNaN(orderId))
      return res.status(400).json({ message: "Invalid Order ID" });

    const order = await orderService.getOrderById(userId, orderId);
    res.json(order);
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

export default { getMyOrders, getOrderDetail };
