import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware"; // Middleware xác thực của bạn
import reviewService from "../../services/user/reviewService";

const create = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId, rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const review = await reviewService.createReview({
      userId,
      productId: Number(productId),
      rating: Number(rating),
      comment,
    });

    res.status(201).json({
      message: "Cảm ơn bạn đã đánh giá sản phẩm!",
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Lỗi tạo đánh giá" });
  }
};

const getByProduct = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Number(req.params.productId);
    const reviews = await reviewService.getProductReviews(productId);

    res.json({ data: reviews });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default { create, getByProduct };
