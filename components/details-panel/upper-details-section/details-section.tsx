import { FullConventionDetails, Scope } from "@/types/con-types";
import YearGallery from "./year-detail";
import { DAYS_UNTIL_UPCOMING } from "@/lib/constants";
import { parseISO } from "date-fns";
import MoreDetailsSection from "./more-details-section";
import { MdEdit } from "react-icons/md";
import { useModalUIStore } from "@/stores/ui-store";
import { FaLink } from "react-icons/fa6";

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
  const setEditingModalPage = useModalUIStore((s) => s.setEditingModalPage);
  const latestYear = [...details.convention_years].sort(
    (a, b) => b.year - a.year
  )[0];
  const showMissingCard = shouldShowMissingCard(
    latestYear.end_date ?? undefined
  );

  return (
    <>
      <div className="flex flex-row justify-between mb-6 mx-6">
        {details.website && (
          <a
            href={details.website}
            target="_blank"
            rel="noopener noreferrer"
            title={`${details.name} website`}
            className="flex flex-row gap-1 items-center text-primary-text  
          text-sm font-semibold hover:text-primary-darker transition-colors"
          >
            <FaLink className="-rotate-5 h-4 w-4" />
            Website
          </a>
        )}
        <button
          type="button"
          onClick={() => setEditingModalPage("editor")}
          className="text-xs cursor-pointer hover:underline flex flex-row gap-0.5 text-secondary-darker "
        >
          <MdEdit className="translate-y-[1px]" />
          Edit Con Info
        </button>
      </div>
      <div className="mb-6">
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

      <div className="p-4 flex flex-col gap-2 text-sm px-6 rounded-lg">
        <div className="flex flex-row justify-between">
          <h3 className="text-primary-muted font-semibold uppercase">
            Convention Info
          </h3>
        </div>

        {details.cs_description ? (
          <p className="leading-6 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
            {details.cs_description}
          </p>
        ) : (
          <p className="text-primary-muted">
            This con doesn’t have a description yet.
          </p>
        )}
        <hr className="border-t border-primary-muted my-2 mx-auto w-16 border-0.5" />
        <MoreDetailsSection scope={scope} details={details} />
      </div>
    </>
  );
}
