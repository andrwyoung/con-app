import { grabAllReviewsForConvention } from "@/lib/details/grab-all-reviews";
import { useUserStore } from "@/stores/user-store";
import React, { useEffect, useState } from "react";
import ReviewCard from "./review-card";
import ReviewModal from "./review-modal";
import { UUID } from "crypto";
// import AllReviews from "./all-reviews";

export type Review = {
  review_id: UUID;
  user_id: string;
  convention_id: number;
  stars: number;
  review_text: string;

  // grabbing username too
  user_profiles?: {
    username: string;
  };
};

export default function ReviewsSection({ id }: { id: number }) {
  const profile = useUserStore((s) => s.profile);
  const [reviews, setReviews] = useState<Review[]>([]);

  // grab con data from database
  useEffect(() => {
    const init = async () => {
      const allReviews = await grabAllReviewsForConvention(id);
      console.log("all reviews", allReviews);

      setReviews(allReviews);
    };

    init();
  }, [id]);

  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex flex-row justify-between items-baseline mb-4">
        <h1 className="uppercase text-sm font-semibold text-primary-muted">
          Reviews
        </h1>
        {profile ? (
          <ReviewModal conId={id} />
        ) : (
          <p className="text-xs text-primary-muted ">
            Sign in to leave a review
          </p>
        )}
      </div>

      <div className="flex flex-col items-center">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.review_id} review={review} />
          ))
        ) : (
          <p className="text-sm text-primary-muted text-center">
            No reviews yet. <br />
            Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
}
