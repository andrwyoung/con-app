import { formatReviewDate } from "@/lib/helpers/review-time";
import { useUserStore } from "@/stores/user-store";
import { Review } from "@/types/reviews";
import { FiEdit3 } from "react-icons/fi";

export default function ReviewCard({
  review,
  onEditClick,
}: {
  review: Review;
  onEditClick: (r: Review) => void;
}) {
  const profile = useUserStore((s) => s.profile);

  return (
    <div className="flex flex-col w-full gap-1">
      <div className="flex flex-row justify-between items-center pr-2">
        <div className="flex flex-row gap-1 items-center">
          <h3 className="text-sm text-primary-text">
            {review.user_profiles?.username ?? "unknown user"}
          </h3>
          {profile && profile.user_id === review.user_id && (
            <FiEdit3
              onClick={() => onEditClick(review)}
              title="Edit your note"
              className="w-4 h-4 translate-y-[1px] text-primary-muted cursor-pointer hover:text-primary-darker transition-colors"
            />
          )}
        </div>

        <p className="text-xs text-primary-muted">
          {formatReviewDate(review.created_at)}
        </p>
      </div>
      <p className="text-sm leading-relaxed"> {review.review_text}</p>
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-y-2 gap-x-1 w-full mt-1">
          {review.tags.map((tag) => (
            <div
              key={tag}
              className={`rounded-full border-1 px-2 py-0.5 text-xs font-medium transition 
                bg-primary-lightest text-primary-text border-primary-light`}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
