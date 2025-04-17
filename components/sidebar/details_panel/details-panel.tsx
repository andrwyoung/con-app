import { grabAllDetails } from "@/lib/searching/grab-all-details";
import { EventInfo, FullConventionDetails } from "@/types/types";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import YearGallery from "./year-detail";
import SocialLinks from "./display-links";
import { FaLink } from "react-icons/fa6";
import { DAYS_UNTIL_DISCONTINUED, DAYS_UNTIL_UPCOMING } from "@/lib/constants";

function shouldShowMissingCard(endDate: string | undefined): boolean {
  if (!endDate) return false;

  const now = new Date();
  const lastEnd = new Date(endDate);
  const daysSinceEnd =
    (now.getTime() - lastEnd.getTime()) / (1000 * 60 * 60 * 24);

  return (
    daysSinceEnd > DAYS_UNTIL_UPCOMING && daysSinceEnd < DAYS_UNTIL_DISCONTINUED
  );
}

export default function DetailsPanel({
  con,
  onClose,
}: {
  con: EventInfo;
  onClose: () => void;
}) {
  const [details, setDetails] = useState<FullConventionDetails | null>(null);
  const showMissingCard = shouldShowMissingCard(con.end_date);

  // grab con data from database
  useEffect(() => {
    const init = async () => {
      const conDetails = await grabAllDetails(con.id);
      console.log("details panel full con data:", conDetails);

      setDetails(conDetails);
    };

    init();
  }, [con.id]);

  return (
    <div className="w-96 max-h-180 bg-white rounded-lg shadow-xl border">
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600 hover:scale-105"
        onClick={onClose}
        aria-label="close details panel"
      >
        <FiX />
      </button>
      <div className="flex flex-col px-4 pt-8 pb-6 gap-2">
        <h2 className="text-2xl px-2 mb-4 text-primary-text font-semibold">
          {con.name}
        </h2>
        {details ? (
          <>
            <div>
              {details.convention_years.length > 0 &&
                details.venue &&
                details.location && (
                  <YearGallery
                    currentYear={con.year as number}
                    allYears={details.convention_years}
                    venue={details.venue}
                    location={details.location}
                    showMissing={showMissingCard}
                  />
                )}
            </div>
            <div className="flex flex-row justify-between items-baseline pl-6 pr-8">
              {details.website && (
                <a
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${con.name} website`}
                  className="flex flex-row gap-2 items-center text-primary-muted hover:text-primary-darker transition-colors"
                >
                  <FaLink className="-rotate-5 h-5 w-5 translate-y-0.5" /> Main
                  Website
                </a>
              )}
              {details.social_links && (
                <SocialLinks links={details.social_links} />
              )}
            </div>

            <hr className="border-t border-primary-muted w-full my-4" />

            <div className="px-2 flex flex-col gap-2 text-sm">
              <h3 className="text-primary-muted font-semibold uppercase">
                Description
              </h3>
              <p className="leading-6 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
                {details.description}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm italic text-primary-muted">Loading details…</p>
        )}
      </div>
    </div>
  );
}
