import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import orderService from "../../services/user/orderService";

const create = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    // Lấy voucherCode từ body (khớp với logic chúng ta vừa sửa)
    const { shippingAddressId, paymentMethod, voucherCode } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const order = await orderService.createOrder({
      userId,
      shippingAddressId: Number(shippingAddressId),
      paymentMethod,
      voucherCode,
    });

    res
      .status(201)
      .json({ message: "Order created successfully", data: order });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || "Tạo đơn thất bại" });
  }
};

const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await orderService.getMyOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders" });
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

export default { create, getMyOrders, getOrderDetail };
