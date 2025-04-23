import { grabAllDetails } from "@/lib/details/grab-all-details";
import { ConventionInfo, FullConventionDetails } from "@/types/types";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import DetailsSection from "./upper-details-section/details-section";
import ReviewsSection from "./reviews-section/reviews-section";

export default function DetailsPanel({
  con,
  onClose,
}: {
  con: ConventionInfo;
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
    <div className="relative w-96 max-h-[calc(100vh-10rem)] bg-white rounded-lg shadow-xl border flex flex-col">
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600 hover:scale-105 z-10"
        onClick={onClose}
        aria-label="close details panel"
      >
        <FiX />
      </button>
      <div className="flex relative flex-col min-h-0 px-4 pt-8 pb-6 gap-2">
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

          <hr className="border-t border-primary-muted mt-8 mb-4 mx-auto w-80 border-0.5" />

          <ReviewsSection id={con.id} />
        </div>
      </div>
    </div>
  );
}
