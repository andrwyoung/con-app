import { useUserStore } from "@/stores/user-store";
import React from "react";
// import AllReviews from "./all-reviews";

export default function ReviewsSection() {
  const profile = useUserStore((s) => s.profile);
  // const reviews = [];

  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex flex-row justify-between items-baseline mb-4">
        <h1 className="uppercase text-sm font-semibold text-primary-muted">
          Reviews
        </h1>
        {profile ? (
          <a
            href="mailto:andrew@jonadrew.com"
            className="bg-primary-lightest cursor-pointer text-primary-text border-2 border-primary 
            uppercase text-xs px-4 py-1 rounded-full hover:bg-primary focus:outline-none"
          >
            Submit a review
          </a>
        ) : (
          <p className="text-xs text-primary-muted ">
            Sign in to leave a review
          </p>
        )}
      </div>

      <div className="flex flex-col items-center">
        {/* {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : ( */}
        <p className="text-sm text-primary-muted text-center">
          No reviews yet. <br />
          Be the first to share your thoughts!
        </p>
        {/* )} */}
      </div>
    </div>
  );
}
