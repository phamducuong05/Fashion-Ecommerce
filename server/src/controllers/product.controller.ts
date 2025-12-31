import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/response";
import { AppError } from "../utils/AppError";

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { keyword, minPrice, maxPrice, color, sort } = req.query;

  const params = {
    keyword: keyword as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    color: color as string,
    sort: sort as string,
  };

  const products = await productService.getAllProducts(params);
  sendResponse(res, 200, products);
});

export const getProductDetail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return next(new AppError("ID sản phẩm không hợp lệ", 400));
  }

  const product = await productService.getProductById(id);

  if (!product) {
    return next(new AppError("Không tìm thấy sản phẩm", 404));
  }

  sendResponse(res, 200, product);
});
