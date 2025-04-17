"use client";
import Sidebar from "@/app/explore/sidebar";
import { useEffect } from "react";
import {
  useMapCardsStore,
  useSidebarStore,
} from "@/stores/explore-sidebar-store";
import { useMapStore } from "@/stores/map-store";
import { useUIStore } from "@/stores/ui-store";
import DetailsPanel from "@/components/sidebar/details_panel/details-panel";

export default function ExplorePage() {
  const { selectedCon, setSelectedCon } = useSidebarStore();
  const clearSelectedEvents = useMapCardsStore((s) => s.clearSelectedEvents);

  const isModalOpen = useUIStore.getState().anyModalOpen();

  // keyboard shortcuts
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      if (isModalOpen) return; // important to check if modal is open
      if (e.key === "Escape") {
        const active = document.activeElement;
        const isInputFocused =
          active &&
          (active.tagName === "INPUT" || active.tagName === "TEXTAREA");

        if (isInputFocused) return;

        const {
          selectedCon,
          setSelectedCon,
          setSidebarModeAndDeselectCon,
          sidebarMode,
        } = useSidebarStore.getState();

        console.log("escape pressed! selected con:", selectedCon);

        // 1st escape deselects con
        // 2nd escape changes mode back to filter
        if (selectedCon) {
          setSelectedCon(null);
          useMapStore.getState().clearSelectedPointHighlight?.();
        } else if (sidebarMode === "filter") {
          clearSelectedEvents();
          useMapStore.getState().clearClickedClusterHighlight?.();
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
  }, [isModalOpen, clearSelectedEvents]);

  return (
    <div className="w-screen h-screen font-extrabold">
      <div className="absolute z-10 top-32 left-12">
        <Sidebar />
      </div>
      {selectedCon && (
        <div className="absolute right-12 top-32 z-17">
          <DetailsPanel
            con={selectedCon}
            onClose={() => setSelectedCon(null)}
          />
        </div>
      )}
    </div>
  );
}
