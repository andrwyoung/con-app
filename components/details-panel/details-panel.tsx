import { grabAllDetails } from "@/lib/details/grab-all-details";
import { ConventionInfo, FullConventionDetails, Scope } from "@/types/types";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import DetailsSection from "./upper-details-section/details-section";
import ReviewsSection from "./reviews-section/reviews-section";
import { log } from "@/lib/utils";
import { TbFocus } from "react-icons/tb";
import {
  useExploreSidebarStore,
  usePlanSidebarStore,
  useScopedSelectedCardsStore,
} from "@/stores/sidebar-store";
import { useMapStore } from "@/stores/map-store";
import { DEFAULT_ZOOM } from "@/lib/constants";
import { getRealDates, getRealYear } from "@/lib/calendar/grab-real-dates";
import { findWeekendBucket } from "@/lib/calendar/determine-weekend";

export default function DetailsPanel({
  scope,
  con,
  onClose,
}: {
  scope: Scope;
  con: ConventionInfo;
  onClose: () => void;
}) {
  const [details, setDetails] = useState<FullConventionDetails | null>(null);
  const { selectedCon, setSelectedCon, setFocusedEvents, focusedEvents } =
    useScopedSelectedCardsStore(scope);
  const setSelectedWeekend = usePlanSidebarStore((s) => s.setSelectedWeekend);
  const setSidebarMode = usePlanSidebarStore((s) => s.setSidebarMode);
  const sidebarMode = useExploreSidebarStore((s) => s.sidebarMode);
  const flyTo = useMapStore((s) => s.flyTo);

  // grab con data from database
  useEffect(() => {
    const init = async () => {
      const conDetails = await grabAllDetails(con.id);
      log("details panel full con data:", conDetails);

      setDetails(conDetails);
    };

    init();
  }, [con.id]);

  function handleRefocus() {
    if (!selectedCon) return; // should never happen lol, but turning off TS errors

    // scroll into view if open in any panel
    // note: this is a very jank solution. trying to retrigger useEffects
    setSelectedCon({ ...(selectedCon as ConventionInfo) });

    // explore
    // 1: fly into view
    // 2: if it's not showing on a list, then select it
    const long = selectedCon?.location_long;
    const lat = selectedCon?.location_lat;
    if (scope === "explore" && long && lat) {
      flyTo?.({ latitude: lat, longitude: long }, DEFAULT_ZOOM);

      const alreadyFocused = focusedEvents.some(
        (event) => event.id === selectedCon.id
      );

      if (sidebarMode === "filter" && !alreadyFocused) {
        setFocusedEvents([selectedCon]);
      }
      // plan logic
      // 1: select that weekend
      // 2: if in search mode and it's not in there, then leave? idk
    } else if (scope === "plan") {
      setSidebarMode("calendar");

      const { start_date, end_date } = getRealDates(selectedCon);
      const bucket = findWeekendBucket(start_date, end_date);
      setSelectedWeekend(bucket);
    }
  }

  return (
    <div className="w-96 max-h-[calc(100vh-10rem)] bg-white rounded-lg shadow-xl border flex flex-col">
      <div className="flex flex-row items-center justify-between gap-2 z-10 p-4 pb-2 ">
        <button
          type="button"
          title="Focus on Convention"
          onClick={handleRefocus}
          className="flex gap-1 items-center text-primary-text rounded-full hover:scale-105 cursor-pointer hover:bg-primary-light px-1.5 py-0.5 transition-all"
        >
          <TbFocus className="w-3 h-3" />
          <p className="text-xs">
            Focus {scope === "plan" && selectedCon && getRealYear(selectedCon)}
          </p>
        </button>

        <button
          type="button"
          className="text-gray-400 cursor-pointer hover:text-gray-600 hover:scale-105 rounded-full hover:bg-primary-light p-1 transition-all"
          onClick={onClose}
          aria-label="close details panel"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>

      <div className="flex relative flex-col min-h-0 px-4 pb-6 gap-2">
        <h2 className="text-2xl px-2 mb-4 text-primary-text font-semibold">
          {con.name}
        </h2>
        <div className="flex-1 overflow-y-auto scrollbar-none scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
          {details ? (
            <DetailsSection details={details} scope={scope} />
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
