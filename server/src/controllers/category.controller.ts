import { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/response";

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  sendResponse(res, 200, categories);
});
