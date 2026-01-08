import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/AppError";

const prisma = new PrismaClient();

interface CreateReviewInput {
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
}

const createReview = async ({
  userId,
  productId,
  rating,
  comment,
}: CreateReviewInput) => {
  if (rating < 1 || rating > 5) {
    throw new AppError("Đánh giá phải từ 1 đến 5 sao", 400);
  }

  const hasPurchased = await prisma.order.findFirst({
    where: {
      userId: userId,
      status: "COMPLETED",
      orderItems: {
        some: {
          variant: {
            productId: productId,
          },
        },
      },
    },
  });

  if (!hasPurchased) {
    throw new AppError(
      "Bạn phải mua và nhận đơn hàng này thành công trước khi đánh giá!",
      403
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
  });

  if (existingReview) {
    throw new AppError("Bạn đã đánh giá sản phẩm này rồi.", 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
      },
    });

    const aggregations = await tx.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const newAverageRating = aggregations._avg.rating || 0;
    const newReviewCount = aggregations._count.rating || 0;

    await tx.product.update({
      where: { id: productId },
      data: {
        rating: newAverageRating,
        reviewCount: newReviewCount,
      },
    });

    return newReview;
  });

  return result;
};

// Lấy danh sách review
const getProductReviews = async (productId: number) => {
  return await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export default { createReview, getProductReviews };
