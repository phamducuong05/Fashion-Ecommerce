import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as cartService from "../services/cartService"; // Import Service

// 1. Lấy giỏ hàng
export const getMyCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Gọi Service
    const cart = await cartService.findCartByUserId(userId);

    res.status(200).json({ data: cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy giỏ hàng", error });
  }
};

// 2. Thêm vào giỏ
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    // Validation cơ bản
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!productId || !quantity)
      return res
        .status(400)
        .json({ message: "Thiếu thông tin product hoặc quantity" });

    // Gọi Service
    const item = await cartService.addItemToCart(
      userId,
      productId,
      Number(quantity),
    );

    res.status(200).json({ message: "Đã thêm vào giỏ thành công", data: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi thêm vào giỏ", error });
  }
};
