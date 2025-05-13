import { formatReviewDate } from "@/lib/helpers/time/review-time";
import { useUserStore } from "@/stores/user-store";
import { Review } from "@/types/review-types";
import { FiEdit3 } from "react-icons/fi";

export default function ReviewCard({
  review,
  onEditClick,
  backgroundStyle,
}: {
  review: Review;
  onEditClick: (r: Review) => void;
  backgroundStyle?: string;
}) {
  const profile = useUserStore((s) => s.profile);

  return (
    <div
      className={`flex flex-col w-full px-6 py-4 rounded-lg ${backgroundStyle}`}
    >
      <div className="flex flex-row justify-between items-center pr-2 mb-0.5">
        <div className="flex flex-row items-center">
          <h3
            className={`text-sm text-primary-text ${
              review.anonymous ? "font-medium italic" : "font-semibold"
            }`}
          >
            {review.anonymous
              ? "anonymous"
              : review.user_profiles?.username ?? "unknown user"}
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
      <p className="text-xs mb-2 leading-loose"> {review.review_text}</p>
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-y-2 gap-x-2 w-full mt-1">
          {review.tags.map((tag) => (
            <div
              key={tag}
              className={`rounded-full outline-1 px-2 py-0.5 text-xs shadow-xs font-medium transition 
                bg-white text-primary-text outline-primary`}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
