import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/response";
import * as authService from "../services/auth.service";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await authService.register(req.body);
  sendResponse(res, 201, { user, token }, "User registered successfully");
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await authService.login(req.body);
  sendResponse(res, 200, { user, token }, "Logged in successfully");
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body);
  sendResponse(res, 200, result, "Password reset successfully");
});
