"use client";
import Sidebar from "@/components/sidebar/sidebar";
import Map from "./map";
import { useEffect, useState } from "react";
import { ConLocation } from "@/types/types";
import getInitialLocation from "../../lib/map/get-initial-location";
import { useEventStore } from "@/stores/all-events-store";
import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { useMapStore } from "@/stores/map-store";
import { useUIStore } from "@/stores/ui-store";
import { useRouter, useSearchParams } from "next/navigation";

export default function ExplorePage() {
  const [initLocation, setInitLocation] = useState<ConLocation | null>(null);
  const [showMap, setShowMap] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const setLoginStep = useUIStore((s) => s.setLoginModalStep);

  // initialization steps:
  // 1: get initial coordinates to center the map
  // 2: load all events in the background
  // TODO memoize events inside useEffect
  useEffect(() => {
    const init = async () => {
      const coords = await getInitialLocation();
      if (coords) setInitLocation(coords);
      useMapStore.getState().setUserLocation(coords); //save coords to map

      await useEventStore.getState().fetchAllEvents();
    };

    init();
  }, []);

  // keyboard shortcuts
  const isModalOpen = useUIStore.getState().anyModalOpen();
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      if (isModalOpen) return; // important to check if modal is open
      if (e.key === "Escape") {
        const active = document.activeElement;
        const isInputFocused =
          active &&
          (active.tagName === "INPUT" || active.tagName === "TEXTAREA");

        if (isInputFocused) return;

        const { selectedCon, setSelectedCon, setSidebarModeAndDeselectCon } =
          useSidebarStore.getState();
        console.log("escape pressed! selected con:", selectedCon);

        // 1st escape deselects con
        // 2nd escape changes mode back to filter
        if (selectedCon) {
          setSelectedCon(null);
          useMapStore.getState().clearSelectedPointHighlight?.();
        } else {
          setSidebarModeAndDeselectCon("filter");
        }
      }

      // Cmd + L to focus the search bar
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        const input = document.getElementById("explore-searchbar");
        if (input instanceof HTMLInputElement) {
          input.focus();
        }
        return;
      }
    };
    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, [isModalOpen]);

  // manual timer so we can fade in the map....effective sometimes lol
  // also gives us time to load all events
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMap(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setLoginStep("email");
      router.replace("/explore", { scroll: false });
    }
  }, [searchParams, router, setLoginStep]);

  return (
    <div className="w-screen h-screen font-extrabold">
      <Sidebar />
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
