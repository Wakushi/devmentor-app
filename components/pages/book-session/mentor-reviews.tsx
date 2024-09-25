import { Review } from "@/lib/types/review.type"
import { StarIcon } from "lucide-react"

export default function MentorReviews({ reviews }: { reviews: Review[] }) {
  const lastTwoReviews = reviews.slice(-2).reverse()

  return (
    <div className="flex-2">
      <h3 className="text-lg font-semibold mb-2">Latest Reviews</h3>
      {lastTwoReviews.length > 0 ? (
        lastTwoReviews.map((review, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-10 rounded-lg p-3 mb-2"
          >
            <div className="flex items-center mb-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rate
                      ? "text-primary fill-primary"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-200">{review.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400">No reviews yet.</p>
      )}
    </div>
  )
}
