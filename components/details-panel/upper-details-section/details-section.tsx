import { FullConventionDetails, Scope } from "@/types/types";
import YearGallery from "./year-detail";
import { DAYS_UNTIL_UPCOMING } from "@/lib/constants";
import { FaLink } from "react-icons/fa6";
import SocialLinks from "./display-links";
import { useFilterStore } from "@/stores/filter-store";
import { useExploreGeneralUIStore, useModalUIStore } from "@/stores/ui-store";
import { useCurrentScope } from "@/hooks/use-current-scope";
import { MdEdit } from "react-icons/md";
import EditConventionModal from "../edit-modal/edit-con-modal";
import { parseISO } from "date-fns";

function shouldShowMissingCard(endDate: string | undefined): boolean {
  if (!endDate) return false;

  const now = new Date();
  const lastEnd = parseISO(endDate);
  const daysSinceEnd =
    (now.getTime() - lastEnd.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceEnd > DAYS_UNTIL_UPCOMING && daysSinceEnd < 365;
}

export default function DetailsSection({
  scope,
  details,
}: {
  scope: Scope;
  details: FullConventionDetails;
}) {
  const setTagFilter = useFilterStore((s) => s.setTagFilter);
  const tagFilter = useFilterStore((s) => s.tagFilter);
  const setShownFilters = useExploreGeneralUIStore((s) => s.setShownFilters);
  const resetAllFilters = useFilterStore((s) => s.resetAllFilters);
  const setEditingModalPage = useModalUIStore((s) => s.setEditingModalPage);

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
        <div className="flex flex-row justify-between">
          <h3 className="text-primary-muted font-semibold uppercase">
            Description
          </h3>
          <div className="flex flex-row gap-0.5 text-secondary-darker ">
            <EditConventionModal conDetails={details} />
            <MdEdit className="translate-y-[1px]" />
            <button
              type="button"
              onClick={() => setEditingModalPage("editor")}
              className="text-xs cursor-pointer hover:underline"
            >
              Edit Info
            </button>
          </div>
        </div>

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
              scope={scope}
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
                if (scope === "explore") {
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (
                          tagFilter.selected.length === 1 &&
                          tagFilter.selected[0] === tag &&
                          tagFilter.includeUntagged === false
                        ) {
                          resetAllFilters();
                          setShownFilters([]);
                        } else {
                          setTagFilter([tag], false);
                          setShownFilters(["tags"]);
                        }
                      }}
                      className="px-2 py-0.5 rounded-full bg-primary-lightest text-primary-muted hover:underline cursor-pointer"
                    >
                      #{tag}
                    </button>
                  );
                } else {
                  return (
                    <div
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-primary-lightest text-primary-muted"
                    >
                      #{tag}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
