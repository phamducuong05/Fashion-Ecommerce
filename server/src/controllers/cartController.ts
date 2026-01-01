import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import cartService from "../services/cart.service";

// GET /api/cart
const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id; // Lấy từ token
    const cartItems = await cartService.getCart(userId);

    // Trả về đúng mảng CartItemProps mà frontend cần
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy giỏ hàng" });
  }
};

// POST /api/cart/add
const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    // Frontend gửi lên variantId và quantity
    const { variantId, quantity } = req.body;

    if (!variantId || !quantity) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
    }

    await cartService.addToCart(userId, Number(variantId), Number(quantity));
    res.json({ message: "Đã thêm vào giỏ hàng" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi thêm giỏ hàng" });
  }
};

// PUT /api/cart/:id (Update Quantity)
const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id; // Đây là ID của CartItem (Frontend gửi string)
    const { quantity } = req.body;

    await cartService.updateQuantity(
      userId,
      Number(cartItemId),
      Number(quantity)
    );

    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi cập nhật giỏ hàng" });
  }
};

// DELETE /api/cart/:id
const removeItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;

    await cartService.removeItem(userId, Number(cartItemId));

    res.json({ message: "Đã xóa sản phẩm" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi xóa sản phẩm" });
  }
};

export default { getCart, addToCart, updateItem, removeItem };
