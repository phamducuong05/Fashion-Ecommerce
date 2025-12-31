import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/response";
import { AppError } from "../utils/AppError";
import * as reviewService from "../services/review.service";

export const createReview = catchAsync(async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;
  const productId = Number(req.params.id);
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  const review = await reviewService.createReview({
    userId,
    productId,
    rating,
    comment,
  });

  sendResponse(res, 201, review, "Review created successfully");
});

export const getReviews = catchAsync(async (req: Request, res: Response) => {
  const productId = Number(req.params.id);

  const reviews = await reviewService.getReviewsByProductId(productId);

  sendResponse(res, 200, reviews);
});
