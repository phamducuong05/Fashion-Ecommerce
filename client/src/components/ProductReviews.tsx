import { useState, useEffect } from "react";
import { Star, Loader2, Send } from "lucide-react";
import { Button } from "../components/variants/button"; // Đảm bảo đường dẫn đúng
import { useNavigate } from "react-router";
import { useToast } from "./Toast";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
    avatar: string | null;
  };
}

interface ProductReviewsProps {
  productId: string | number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const navigate = useNavigate();

  // State dữ liệu
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Form đánh giá
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { showToast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${productId}`);
        const data = await res.json();
        if (data.data) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // 2. Xử lý gửi Review
  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Please login to leave comment!", "warning");
      navigate("/signin");
      return;
    }

    if (userRating === 0) {
      showToast("You forgot the stars!", "warning");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating: userRating,
          comment: userComment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Không thể gửi đánh giá");
      }

      // Thành công: Thêm review mới vào list ngay lập tức (Optimistic update)
      // Hoặc gọi lại API fetchReviews
      const newReview: Review = {
        id: Date.now(), // ID tạm
        rating: userRating,
        comment: userComment,
        createdAt: new Date().toISOString(),
        user: {
          // Giả lập thông tin user hiện tại (thực tế nên lấy từ user context)
          id: 0,
          name: "Bạn",
          avatar: null,
        },
      };

      setReviews([newReview, ...reviews]);

      // Reset form
      setUserRating(0);
      setUserComment("");
      showToast("Thank you for your review!", "success");
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper render sao (cho hiển thị)
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Helper render sao (cho input form - có click)
  const renderInputStars = () => {
    return (
      <div className="flex items-center gap-1 cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => setUserRating(star)}
            className={`w-6 h-6 transition-all hover:scale-110 ${
              star <= userRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md mt-8 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        User Review ({reviews.length})
      </h2>

      {/* --- FORM VIẾT ĐÁNH GIÁ --- */}
      <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">
          Leave your comments
        </h3>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">
            How many stars ?
          </label>
          {renderInputStars()}
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">
            Detailed Review
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows={3}
            placeholder="Share your opinions of the product..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
          ></textarea>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">
            ⚠️ {errorMsg}
          </p>
        )}

        <Button
          onClick={handleSubmitReview}
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Submit Review
        </Button>
      </div>

      {/* --- DANH SÁCH REVIEW --- */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          Đang tải đánh giá...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          No comment yet. Be the first to buy and leave comment!
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-0"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {review.user.avatar ? (
                        <img
                          src={review.user.avatar}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-gray-500 text-xs">
                          {review.user.name
                            ? review.user.name.charAt(0).toUpperCase()
                            : "U"}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {review.user.name || "Anonymous"}
                    </span>
                    {/* Backend logic đảm bảo đã mua hàng mới được review, nên ta auto hiện verified */}
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      You have bought
                    </span>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
