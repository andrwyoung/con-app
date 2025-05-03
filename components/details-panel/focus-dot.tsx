import { findWeekendBucket } from "@/lib/calendar/determine-weekend";
import { getRealDates, getRealYear } from "@/lib/calendar/grab-real-dates";
import { DEFAULT_ZOOM } from "@/lib/constants";
import { useMapStore } from "@/stores/map-store";
import {
  useExploreSidebarStore,
  usePlanSidebarStore,
  useScopedSelectedCardsStore,
} from "@/stores/page-store";
import { ConventionInfo, Scope } from "@/types/con-types";
import React from "react";
import { TbFocus } from "react-icons/tb";

export default function FocusDot({ scope }: { scope: Scope }) {
  const { selectedCon, setSelectedCon, setFocusedEvents, focusedEvents } =
    useScopedSelectedCardsStore(scope);
  const setSelectedWeekend = usePlanSidebarStore((s) => s.setSelectedWeekend);
  const setSidebarMode = usePlanSidebarStore((s) => s.setSidebarMode);
  const sidebarMode = useExploreSidebarStore((s) => s.sidebarMode);
  const flyTo = useMapStore((s) => s.flyTo);

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
    <button
      type="button"
      title="Focus on Convention"
      onClick={handleRefocus}
      className="flex gap-1 items-center text-primary-text rounded-full hover:scale-105 cursor-pointer hover:bg-primary-light px-1.5 py-0.5 transition-all"
    >
      <TbFocus className="w-3 h-3" />
      <p className="text-xs">
        Focus{" "}
        {scope === "plan" && selectedCon ? `(${getRealYear(selectedCon)})` : ""}
      </p>
    </button>
  );
}
