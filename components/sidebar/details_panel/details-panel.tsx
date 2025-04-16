import { grabAllDetails } from "@/lib/searching/grab-all-details";
import { EventInfo, FullConventionDetails } from "@/types/types";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import YearGallery from "./year-detail";

export default function DetailsPanel({
  con,
  onClose,
}: {
  con: EventInfo;
  onClose: () => void;
}) {
  const [details, setDetails] = useState<FullConventionDetails | null>(null);

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
      <div className="flex flex-col px-4 pt-8 pb-6 gap-8">
        <h2 className="text-2xl text-primary-text font-semibold">{con.name}</h2>
        {details ? (
          <div className="flex flex-col gap-4">
            {details.convention_years.length > 0 &&
              details.venue &&
              details.location && (
                <YearGallery
                  allYears={details.convention_years}
                  venue={details.venue}
                  location={details.location}
                />
              )}
            <p className="text-sm leading-6 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
              {" "}
              {details.description}
            </p>
          </div>
        ) : (
          <p className="text-sm italic text-primary-muted">Loading details…</p>
        )}
      </div>
    </div>
  );
}
