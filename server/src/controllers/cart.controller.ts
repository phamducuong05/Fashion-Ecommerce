import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/response";
import * as cartService from "../services/cart.service";
import { AppError } from "../utils/AppError";

// Helper to get userId from authenticated request
// Assumes auth middleware populates req.user
const getUserId = (req: Request): number => {
    // @ts-ignore - Assuming auth middleware adds user
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);
    return Number(userId);
};

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const cart = await cartService.getCart(userId);
  sendResponse(res, 200, cart);
});

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { productId, quantity, color, size } = req.body;
  
  if (!productId || !quantity || !color || !size) {
      throw new AppError("Missing required fields (productId, quantity, color, size)", 400);
  }

  const result = await cartService.addToCart(userId, Number(productId), Number(quantity), color, size);
  sendResponse(res, 200, result, "Item added to cart");
});

export const updateCartItem = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params; // cartItemId
    const { quantity } = req.body;

    const result = await cartService.updateCartItem(userId, Number(id), Number(quantity));
    sendResponse(res, 200, result, "Cart item updated");
});

export const removeFromCart = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params; // cartItemId

    await cartService.removeFromCart(userId, Number(id));
    sendResponse(res, 200, null, "Item removed from cart");
});
