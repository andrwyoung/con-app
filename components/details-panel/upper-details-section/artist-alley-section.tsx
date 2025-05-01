import { getAAStatus } from "@/lib/helpers/artist-alley/get-aa-status";
import { formatFullSingleDate } from "@/lib/helpers/time/date-formatters";
import {
  artistAlleyStatusLabels,
  getAAStatusColor,
} from "@/types/artist-alley-types";
import { ConventionYear } from "@/types/con-types";
import { normalizeWebsiteLink } from "@/utils/url";

export default function ArtistAlleyStatusSection({
  conYear,
}: {
  conYear: ConventionYear;
}) {
  const status = getAAStatus(
    conYear.start_date,
    conYear.aa_open_date,
    conYear.aa_deadline,
    conYear.aa_real_release,
    conYear.aa_status_override,
    conYear.aa_watch_link,
    conYear.event_status
  );

  const website = conYear.aa_link;
  const deadline = conYear.aa_deadline;
  const opendate = conYear.aa_open_date;

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-1">
          <h3 className="text-primary-text font-semibold uppercase text-md">
            Artist Alley
          </h3>
          {/* <div className="flex flex-row  text-secondary-darker items-center ">
            <button
              type="button"
              onClick={() => setEditingModalPage("year")}
              className="text-xs cursor-pointer hover:underline"
            >
              <MdEdit className="w-4 h-4" />
            </button>
          </div> */}
        </div>
        <div
          className={`inline-block px-2 py-0.5 rounded-md text-sm font-semibold border-2 shadow-xs 
            ${getAAStatusColor(status)}`}
        >
          {artistAlleyStatusLabels[status]}
        </div>
      </div>

      <div className="text-xs text-primary-muted gap-0.5 pb-4">
        {deadline && (
          <div>
            Closed:{" "}
            <span className="text-primary-text">
              {formatFullSingleDate(deadline)}
            </span>
          </div>
        )}
        {opendate && (
          <div>
            Released:{" "}
            <span className="text-primary-text">
              {formatFullSingleDate(opendate)}
            </span>
          </div>
        )}
        {website && (
          <div>
            Link:{" "}
            <a
              href={normalizeWebsiteLink(website)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer text-primary-text hover:text-primary-muted line-clamp-2"
            >
              {website}
            </a>
          </div>
        )}
        {/* <p>Link: {conYear.convention_id}</p> */}
      </div>
    </>
  );
}
