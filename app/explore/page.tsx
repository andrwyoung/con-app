"use client";
import Sidebar from "@/components/sidebar/sidebar";
import Map from "./map";
import { useEffect, useState } from "react";
import { ConLocation, EventInfo } from "@/types/types";
import getInitialLocation from "./map/get-initial-location";
import getAllEvents from "./map/get-all-events";
import { useEventStore } from "@/stores/all-events-store";
import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { useMapStore } from "@/stores/map-store";

export default function ExplorePage() {
  const [initLocation, setInitLocation] = useState<ConLocation | null>(null);
  const [showMap, setShowMap] = useState(false);

  const { setSelectedCon } = useSidebarStore();

  // initialization
  // 1: initial coordinates to center the map
  // 2: load all events in the background
  // TODO memoize events
  // inside useEffect
  useEffect(() => {
    const init = async () => {
      const coords = await getInitialLocation();
      if (coords) setInitLocation(coords);

      await useEventStore.getState().fetchAllEvents();
    };

    init();
  }, []);

  // if escape key is pressed then close details panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const active = document.activeElement;
        // but check if we're currently in an input
        const isInputFocused =
          active &&
          (active.tagName === "INPUT" || active.tagName === "TEXTAREA");

        // TODO: maybe also check if a modal is open
        if (!isInputFocused) {
          setSelectedCon(null);

          const clearHighlight =
            useMapStore.getState().clearSelectedPointHighlight;
          if (clearHighlight) {
            clearHighlight();
          }
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // manual timer for a spinner lol
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMap(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen font-extrabold">
      <Sidebar />
      {/* <div
        className={`flex flex-row gap-4 items-center justify-center -z-10 absolute inset-0`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-4 border-primary-muted" />
        <div className="text-lg  text-primary-muted">
          Loading Conventions...
        </div>
      </div> */}
      <div
        className={`transition-opacity duration-800 h-full ${
          showMap ? "opacity-100" : "opacity-0"
        }`}
      >
        {initLocation && <Map initLocation={initLocation} />}
      </div>
    </div>
  );
}
