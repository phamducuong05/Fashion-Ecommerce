import { prisma } from "../config/database";
import { AppError } from "../utils/AppError";

interface CreateReviewData {
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
}

export const createReview = async (data: CreateReviewData) => {
  const { userId, productId, rating, comment } = data;

  // 1. Check if user has purchased the product AND order is DELIVERED
  // We need to look for an Order that belongs to userId, has status 'DELIVERED',
  // and contains an OrderItem which refers to a Variant of the Product.
  const hasPurchased = await prisma.order.findFirst({
    where: {
      userId,
      status: "DELIVERED",
      items: {
        some: {
          variant: {
            productId,
          },
        },
      },
    },
  });

  // For testing purposes, we might want to bypass this check if no delivered orders exist yet.
  // But strict requirement is "purchased".
  if (!hasPurchased) {
    throw new AppError(
      "You can only review products you have purchased and received (Delivered).",
      403
    );
  }

  // 2. Check if already reviewed (Optional: limit 1 review per user per product)
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this product.", 400);
  }

  // 3. Create Review
  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
        },
      },
    },
  });

  // 4. Update Product Rating & Review Count
  const aggregations = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: aggregations._avg.rating || 0,
      reviewCount: aggregations._count.rating || 0,
    },
  });

  return review;
};

export const getReviewsByProductId = async (productId: number) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
        },
      },
    },
  });
  return reviews;
};
