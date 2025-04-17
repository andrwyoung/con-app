import { FullConventionDetails } from "@/types/types";
import React from "react";
import YearGallery from "./year-detail";
import { DAYS_UNTIL_UPCOMING } from "@/lib/constants";
import { FaLink } from "react-icons/fa6";
import SocialLinks from "./display-links";

function shouldShowMissingCard(endDate: string | undefined): boolean {
  if (!endDate) return false;

  const now = new Date();
  const lastEnd = new Date(endDate);
  const daysSinceEnd =
    (now.getTime() - lastEnd.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceEnd > DAYS_UNTIL_UPCOMING && daysSinceEnd < 365;
}

export default function DetailsSection({
  details,
}: {
  details: FullConventionDetails;
}) {
  const latestYear = [...details.convention_years].sort(
    (a, b) => b.year - a.year
  )[0];
  const showMissingCard = shouldShowMissingCard(
    latestYear.end_date ?? undefined
  );
  return (
    <>
      <div className="px-2 flex flex-col gap-2 text-sm mb-6">
        <h3 className="text-primary-muted font-semibold uppercase">
          Description
        </h3>
        <p className="leading-6 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
          {details.description}
        </p>
      </div>
      <div>
        {details.convention_years.length > 0 &&
          details.venue &&
          details.location && (
            <YearGallery
              currentYear={latestYear.year as number}
              allYears={details.convention_years}
              venue={details.venue}
              location={details.location}
              showMissing={showMissingCard}
            />
          )}
      </div>
      <div className="flex flex-row justify-between items-baseline pl-6 pr-8 mt-2">
        {details.website && (
          <a
            href={details.website}
            target="_blank"
            rel="noopener noreferrer"
            title={`${details.name} website`}
            className="flex flex-row gap-2 items-center text-primary-muted uppercase text-sm font-semibold hover:text-primary-darker transition-colors"
          >
            <FaLink className="-rotate-5 h-5 w-5 translate-y-0.5" /> Main
            Website
          </a>
        )}
        {details.social_links && <SocialLinks links={details.social_links} />}
      </div>
    </>
  );
}
