import { grabAllDetails } from "@/lib/searching/grab-all-details";
import { EventInfo, FullConventionDetails } from "@/types/types";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import DetailsSection from "./upper-details-section/details-section";
import ReviewsSection from "./reviews-section/reviews-section";

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
    <div className="w-96 max-h-[calc(100vh-13rem)] bg-white rounded-lg shadow-xl border flex flex-col">
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600 hover:scale-105"
        onClick={onClose}
        aria-label="close details panel"
      >
        <FiX />
      </button>
      <div className="flex flex-col min-h-0 px-4 pt-8 pb-6 gap-2">
        <h2 className="text-2xl px-2 mb-4 text-primary-text font-semibold">
          {con.name}
        </h2>
        <div className="flex-1 overflow-y-auto scrollbar-none scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
          {details ? (
            <DetailsSection details={details} />
          ) : (
            <p className="text-sm italic text-primary-muted">
              Loading details…
            </p>
          )}

          <hr className="border-t border-primary-muted w-full my-4" />

          <ReviewsSection />
        </div>
      </div>
    </div>
  );
}
