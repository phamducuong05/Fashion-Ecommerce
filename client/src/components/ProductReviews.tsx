import { Star } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "Sarah Johnson",
    rating: 5,
    date: "2025-11-15",
    comment:
      "Absolutely love these sneakers! They are so comfortable and look great with any outfit. Highly recommend!",
    verified: true,
  },
  {
    id: "2",
    author: "Michael Chen",
    rating: 4,
    date: "2025-11-10",
    comment:
      "Great quality and very comfortable. Only reason for 4 stars is that they run slightly small, so I recommend sizing up.",
    verified: true,
  },
  {
    id: "3",
    author: "Emma Davis",
    rating: 5,
    date: "2025-11-05",
    comment:
      "Best running shoes I've ever owned. The cushioning is perfect and they provide excellent support.",
    verified: true,
  },
  {
    id: "4",
    author: "James Wilson",
    rating: 4,
    date: "2025-10-28",
    comment:
      "Very stylish and comfortable. The quality is excellent for the price point.",
    verified: false,
  },
  {
    id: "5",
    author: "Olivia Martinez",
    rating: 5,
    date: "2025-10-20",
    comment:
      "I wear these all day at work and my feet never hurt. Perfect blend of style and comfort!",
    verified: true,
  },
];

export function ProductReviews() {
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

  return (
    <div className="bg-white rounded-lg shadow-md mt-8 p-8">
      <h2 className="mb-6">Customer Reviews</h2>

      <div className="space-y-6">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 pb-6 last:border-0"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gray-900">{review.author}</span>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
