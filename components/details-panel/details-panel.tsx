import { grabAllDetails } from "@/lib/details/grab-all-details";
import { FullConventionDetails, Scope } from "@/types/con-types";
import { useCallback, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import DetailsSection from "./upper-details-section/details-section";
import ReviewsSection from "./reviews-section/reviews-section";
import EditConventionModal from "../edit-modal/edit-con-modal";
import FocusDot from "./focus-dot";

export default function DetailsPanel({
  scope,
  conId,
  conName,
  onClose,
}: {
  scope: Scope;
  conId: number;
  conName: string;
  onClose?: () => void;
}) {
  const [details, setDetails] = useState<FullConventionDetails | null>(null);

  const handleRefetch = useCallback(async () => {
    const conDetails = await grabAllDetails(conId);
    setDetails(conDetails);
  }, [conId]);

  // grabbing convention details
  useEffect(() => {
    handleRefetch();
  }, [conId, handleRefetch]);

  return (
    <>
      {details && (
        <EditConventionModal
          conDetails={details}
          onSubmitSuccess={handleRefetch}
        />
      )}
      <div className="hidden md:flex flex-row-reverse items-center justify-between gap-2 z-10 p-4 pb-2 ">
        {onClose && (
          <button
            type="button"
            className="text-gray-400 cursor-pointer hover:text-gray-600 hover:scale-105 rounded-full hover:bg-primary-light p-1 transition-all"
            onClick={onClose}
            aria-label="close details panel"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
        {scope !== "unknown" && <FocusDot scope={scope} />}
      </div>

      <div className="h-full flex relative flex-col min-h-0  gap-2">
        <h2 className="flex-none text-2xl px-6  text-primary-text font-semibold">
          {conName}
        </h2>
        <div className="flex-1 overflow-y-auto scrollbar-none scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
          {details ? (
            <DetailsSection details={details} scope={scope} />
          ) : (
            <p className="text-sm italic text-primary-muted px-6 py-4">
              Loading details…
            </p>
          )}
          <div className="flex flex-col bg-primary-lightest/50 mt-4 pt-6 pb-6 rounded-lg">
            <ReviewsSection id={conId} />
          </div>
        </div>
      </div>
    </>
  );
}
