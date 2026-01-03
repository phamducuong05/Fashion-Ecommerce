import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import cartService from "../../services/user/cartService";

// GET /api/cart
const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const cartItems = await cartService.getCart(userId);
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// POST /api/cart/add
const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { variantId, quantity } = req.body;

    if (!variantId || !quantity) {
      return res.status(400).json({ message: "Missing product info" });
    }

    await cartService.addToCart(userId, Number(variantId), Number(quantity));
    res.json({ message: "Added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// PUT /api/cart/:id (Update Quantity)
const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    await cartService.updateQuantity(
      userId,
      Number(cartItemId),
      Number(quantity)
    );

    res.json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart" });
  }
};

// DELETE /api/cart/:id
const removeItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;

    await cartService.removeItem(userId, Number(cartItemId));

    res.json({ message: "Item removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing item" });
  }
};

export default { getCart, addToCart, updateItem, removeItem };
