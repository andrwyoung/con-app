import { FullConventionDetails, Scope } from "@/types/con-types";
import { FaLink } from "react-icons/fa6";
import SocialLinks from "./display-links";
import { useFilterStore } from "@/stores/filter-store";
import { useExploreGeneralUIStore } from "@/stores/ui-store";

export default function MoreDetailsSection({
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

  const cleanedTags = details.tags
    ?.map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return (
    <>
      {/* <h3 className="text-primary-muted font-semibold uppercase text-sm px-2 mb-4">
        More Details
      </h3> */}
      <div className="flex flex-col gap-2 pl-2 pr-4">
        <div className="flex flex-row justify-between items-baseline">
          {details.website && (
            <a
              href={details.website}
              target="_blank"
              rel="noopener noreferrer"
              title={`${details.name} website`}
              className="flex flex-row gap-2 items-center text-primary-muted text-sm font-semibold hover:text-primary-darker transition-colors"
            >
              <FaLink className="-rotate-5 h-5 w-5" />
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
