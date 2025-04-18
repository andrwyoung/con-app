import { Review } from "./reviews-section";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div>
      {review.review_text} {review.user_profiles?.username ?? "unknown user"}{" "}
      {review.stars}
    </div>
  );
}
