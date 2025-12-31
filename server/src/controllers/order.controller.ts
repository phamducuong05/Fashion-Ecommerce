import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/response";
import * as orderService from "../services/order.service";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user.id;
    const { paymentMethod, addressData } = req.body;

    const result = await orderService.createOrder({ userId, paymentMethod, addressData }, req);
    
    sendResponse(res, 201, result, "Order created successfully");
});

export const vnpayReturn = catchAsync(async (req: Request, res: Response) => {
    const result = await orderService.handleVNPayReturn(req.query);
    
    // Redirect to Frontend Success Page
    // Assuming Frontend runs on localhost:5174
    res.redirect(`http://localhost:5174/order-success?id=${result.id}`);
});
