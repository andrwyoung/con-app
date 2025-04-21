"use client";
import Sidebar from "@/app/explore/sidebar";
import { useEffect } from "react";
import {
  useMapCardsStore,
  useSearchStore,
  useSidebarStore,
} from "@/stores/explore-sidebar-store";
import { useMapStore } from "@/stores/map-store";
import { useUIStore } from "@/stores/ui-store";
import DetailsPanel from "@/components/details-panel/details-panel";
import { useSearchParams } from "next/navigation";

export default function ExplorePage() {
  const { selectedCon, setSelectedCon } = useSidebarStore();
  const clearSelectedEvents = useMapCardsStore((s) => s.clearSelectedEvents);

  const isModalOpen = useUIStore.getState().anyModalOpen();
  const searchParams = useSearchParams();

  useEffect(() => {
    // if url says /explore?login=true
    const showLogin = searchParams.get("login") === "true";
    if (showLogin) {
      useUIStore.getState().setLoginModalStep("email");
    }
  }, [searchParams]);

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

        const { selectedCon, setSelectedCon, sidebarMode } =
          useSidebarStore.getState();

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
          useSearchStore.getState().setSearchState(null);
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
      <div className="absolute z-8 top-[13%] left-[2%]">
        <Sidebar />
      </div>
      {selectedCon && (
        <div className="absolute right-[2%] top-[13%] z-5">
          <DetailsPanel
            con={selectedCon}
            onClose={() => setSelectedCon(null)}
          />
        </div>
      )}
    </div>
  );
}
