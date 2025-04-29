import { grabAllReviewsForConvention } from "@/lib/details/grab-all-reviews";
import { useUserStore } from "@/stores/user-store";
import React, { useEffect, useState } from "react";
import ReviewCard from "./review-card";
import ReviewModal from "./review-modal";
import { Review } from "@/types/review-types";
import { log } from "@/lib/utils";

export default function ReviewsSection({ id }: { id: number }) {
  const profile = useUserStore((s) => s.profile);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [editReview, setEditReview] = useState<Review | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleEdit = (review: Review) => {
    setEditReview(review);
    setIsReviewModalOpen(true);
  };

  // grab con data from database
  useEffect(() => {
    const init = async () => {
      const allReviews = await grabAllReviewsForConvention(id);
      log("all reviews", allReviews);

      setReviews(allReviews);
    };

    init();
  }, [id]);

  // let outside code fetch reviews
  const refreshReviews = async () => {
    const allReviews = await grabAllReviewsForConvention(id);
    setReviews(allReviews);
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-row justify-between items-baseline mb-4 px-6">
        <h1 className="uppercase text-sm font-semibold text-primary-muted">
          Notes ({reviews.length})
        </h1>
        {profile ? (
          <>
            <ReviewModal
              conId={id}
              onSubmitted={refreshReviews}
              initialReview={editReview}
              isOpen={isReviewModalOpen}
              setIsOpen={(open) => {
                setIsReviewModalOpen(open);
                if (!open) setEditReview(null); // reset when closing
              }}
            />
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-secondary-lightest cursor-pointer transition-colors text-primary-text border-2 border-secondary
            uppercase text-xs px-4 py-1 rounded-full hover:bg-secondary focus:outline-none"
            >
              Share a Note
            </button>
          </>
        ) : (
          <p className="text-xs text-primary-muted ">Sign in to leave a note</p>
        )}
      </div>

      <div className="flex flex-col items-center">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <>
              <div className="flex flex-col w-64 px-6 pt-4 border-b-2 border-primary-light last:border-none" />
              <ReviewCard
                key={review.review_id}
                review={review}
                onEditClick={handleEdit}
              />
            </>
          ))
        ) : (
          <p className="text-sm text-primary-muted text-center">
            No notes yet. <br />
            Let others know what this convention is like!
          </p>
        )}
      </div>
    </div>
  );
}
