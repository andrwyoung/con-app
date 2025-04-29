import { useModalUIStore } from "@/stores/ui-store";
import {
  ApplicationType,
  applicationTypeLabels,
} from "@/types/artist-alley-types";
import { ConventionYear } from "@/types/types";
import { MdEdit } from "react-icons/md";

export default function ArtistAlleyStatus({
  conYear,
}: {
  conYear: ConventionYear;
}) {
  const status = "unknown";
  const setEditingModalPage = useModalUIStore((s) => s.setEditingModalPage);

  const getPillStyle = (status: ApplicationType) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-400";
      case "expected":
        return "bg-yellow-100 text-yellow-800 border-yellow-400";
      case "closed":
        return "bg-gray-100 text-gray-600 border-gray-300";
      case "no_aa":
        return "bg-stone-100 text-stone-600 border-stone-300";
      case "unknown":
      default:
        return "bg-stone-100 text-stone-600 border-stone-300";
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          <h3 className="text-primary-text font-semibold uppercase text-md">
            Artist Alley
          </h3>
          <div className="flex flex-row  text-secondary-darker ">
            <MdEdit className="translate-y-[1px]" />
            <button
              type="button"
              onClick={() => setEditingModalPage("year")}
              className="text-xs cursor-pointer hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
        <div
          className={`inline-block px-3 py-0.5 rounded-md text-sm font-semibold border-2 shadow-xs ${getPillStyle(
            status
          )}`}
        >
          {applicationTypeLabels[status]}
        </div>
      </div>

      <div className="text-xs text-primary-muted grid grid-cols-2 gap-0.5">
        <p>Deadline: {conYear.artist_app_deadline}</p>

        <p>Link: {conYear.artist_app_link}</p>
        <p>Cost: {conYear.artist_app_first_heard}</p>
      </div>
    </>
  );
}
