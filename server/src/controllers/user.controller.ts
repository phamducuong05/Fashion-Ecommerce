import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/response";
import * as userService from "../services/user.service";

export const getProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore - user is attached by protect middleware
    const userId = req.user.id;
    const user = await userService.getUserProfile(userId);

    sendResponse(res, 200, user);
  }
);

export const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user.id;
    const { fullName, phone } = req.body;

    const updatedUser = await userService.updateUserProfile(userId, {
      fullName,
      phone,
    });

    sendResponse(res, 200, updatedUser, "Profile updated successfully");
  }
);

export const getHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user.id;
    const orders = await userService.getUserOrders(userId);

    sendResponse(res, 200, orders);
  }
);

export const getOrderDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user.id;
    const orderId = Number(req.params.id);

    const order = await userService.getUserOrderById(userId, orderId);

    sendResponse(res, 200, order);
  }
);
