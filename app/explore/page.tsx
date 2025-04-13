"use client";
import Sidebar from "@/components/sidebar/sidebar";
import { useEffect } from "react";
import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { useMapStore } from "@/stores/map-store";
import { useUIStore } from "@/stores/ui-store";

export default function ExplorePage() {
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

  return (
    <div className="w-screen h-screen font-extrabold">
      <Sidebar />
    </div>
  );
}
