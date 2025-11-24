import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as orderService from "../services/orderService";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { shippingAddress, customerName, customerPhone } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!shippingAddress)
      return res.status(400).json({ message: "Vui lòng nhập địa chỉ" });

    const order = await orderService.checkout({
      userId,
      shippingAddress,
      customerName,
      customerPhone,
    });

    res.status(201).json({ message: "Đặt hàng thành công", data: order });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || "Lỗi đặt hàng" });
  }
};
