import { FullConventionDetails } from "@/types/types";
import React from "react";
import YearGallery from "./year-detail";
import { DAYS_UNTIL_UPCOMING } from "@/lib/constants";
import { FaLink } from "react-icons/fa6";
import SocialLinks from "./display-links";
import { useFilterStore, useFilterUIStore } from "@/stores/filter-store";

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
  const setTagFilter = useFilterStore((s) => s.setTagFilter);
  const setShownFilters = useFilterUIStore((s) => s.setShownFilters);

  const latestYear = [...details.convention_years].sort(
    (a, b) => b.year - a.year
  )[0];
  const showMissingCard = shouldShowMissingCard(
    latestYear.end_date ?? undefined
  );
  const cleanedTags = details.tags
    ?.map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return (
    <>
      <div className="px-2 flex flex-col gap-2 text-sm mb-6">
        <h3 className="text-primary-muted font-semibold uppercase">
          Description
        </h3>
        {details.cs_description ? (
          <p className="leading-6 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
            {details.cs_description}
          </p>
        ) : (
          <p className="text-primary-muted">
            This con doesn’t have a description yet. Add one?
          </p>
        )}
      </div>

      <div className="mb-4">
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

      <h3 className="text-primary-muted font-semibold uppercase text-sm px-2 mb-4">
        More Details
      </h3>
      <div className="flex flex-col gap-2 pl-4 pr-8">
        <div className="flex flex-row justify-between items-baseline ">
          {details.website && (
            <a
              href={details.website}
              target="_blank"
              rel="noopener noreferrer"
              title={`${details.name} website`}
              className="flex flex-row gap-2 items-center text-primary-muted text-sm font-semibold hover:text-primary-darker transition-colors"
            >
              <FaLink className="-rotate-5 h-5 w-5" />
              Website
            </a>
          )}
          {details.social_links && <SocialLinks links={details.social_links} />}
        </div>

        {cleanedTags && cleanedTags.length > 0 && (
          <div className="flex flex-row items-center gap-2">
            <p className="text-xs text-primary-muted">Tags:</p>
            <div className="flex flex-wrap gap-1 text-xs">
              {details.tags?.map((tagRaw) => {
                const tag = tagRaw.trim();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setTagFilter([tag], false);
                      setShownFilters(["tags"]);
                    }}
                    className="px-2 py-0.5 rounded-full bg-primary-lightest text-primary-muted hover:underline cursor-pointer"
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
