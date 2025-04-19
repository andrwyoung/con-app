import { grabAllDetails } from "@/lib/details/grab-all-details";
import { ConventionInfo, FullConventionDetails } from "@/types/types";
import { useEffect, useRef, useState } from "react";
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

  const [atBottom, setAtBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // grab con data from database
  useEffect(() => {
    const init = async () => {
      const conDetails = await grabAllDetails(con.id);
      console.log("details panel full con data:", conDetails);

      setDetails(conDetails);
    };

    init();
  }, [con.id]);

  // add gradient if can scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => setAtBottom(isAtBottom(el));

    requestAnimationFrame(check);
    const timeout = setTimeout(check, 150);

    return () => clearTimeout(timeout);
  }, [con.id, scrollRef]);

  function isAtBottom(el: HTMLDivElement) {
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;

    const atBottom = scrollHeight - scrollTop === clientHeight;
    return atBottom;
  }

  return (
    <div className="w-96 max-h-[calc(100vh-13rem)] bg-white rounded-lg shadow-xl border flex flex-col">
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
        <div
          ref={scrollRef}
          onScroll={() => {
            const el = scrollRef.current;
            if (!el) return;

            setAtBottom(isAtBottom(el));
          }}
          className="flex-1 overflow-y-auto scrollbar-none scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent"
        >
          {details ? (
            <DetailsSection details={details} />
          ) : (
            <p className="text-sm italic text-primary-muted">
              Loading details…
            </p>
          )}

          <hr className="border-t border-primary-muted mt-8 mb-4 mx-auto w-80 border-1" />

          <ReviewsSection id={con.id} />
          <div
            className={`pointer-events-none absolute bottom-6 left-0 right-0 h-16 z-1 
            bg-gradient-to-t from-white to-transparent rounded-lg 
            transition-opacity duration-300 
            ${atBottom ? "opacity-0" : "opacity-100"}
          `}
          />
        </div>
      </div>
    </div>
  );
}
