import { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import { useParams } from "react-router";
import { API_URL } from "../config";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    fullName: string | null;
    avatar: string | null;
  };
}

export function ProductReviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}/reviews`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setSuccess("Review submitted successfully!");
      setComment("");
      setRating(5);
      fetchReviews(); // Refresh list
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            className={`focus:outline-none ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
             <Star
                className={`w-5 h-5 ${
                star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
             />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md mt-8 p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Review Form */}
      {token ? (
        <div className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              {renderStars(rating, true)}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black outline-none"
                rows={3}
                placeholder="Share your thoughts..."
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-10 p-4 bg-gray-50 rounded text-center">
            <p>Please <a href="/signin" className="text-blue-600 underline">Sign In</a> to write a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
            <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        ) : (
            reviews.map((review) => (
            <div
                key={review.id}
                className="border-b border-gray-200 pb-6 last:border-0"
            >
                <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                            {review.user.fullName ? review.user.fullName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="font-medium text-gray-900">{review.user.fullName || "Anonymous User"}</span>
                    </div>
                    {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })}
                </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
            </div>
            ))
        )}
      </div>
    </div>
  );
}
