import React, { useEffect, useState } from "react";
import SearchBar from "./searchbar";
import { EventInfo } from "@/types/types";
import DetailsPanel from "./details-panel";
import SearchMode from "./modes/search-mode";
import { useSidebarStore } from "@/stores/explore-sidebar-store";

export type sidebarModes = "search" | "filter" | "map";

export default function Sidebar() {
  const [selectedCon, setSelectedCon] = useState<EventInfo | null>(null);
  const { sidebarMode: mode } = useSidebarStore();

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
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (mode !== "search") {
      setSelectedCon(null);
    }
  }, [mode]);

  return (
    <div className="absolute z-10 top-36 left-8">
      <div className="flex flex-col gap-4 w-80 max-h-180 h-full rounded-lg shadow-lg bg-white px-5 py-6">
        <SearchBar />
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
          {mode === "search" && (
            <SearchMode
              selectedCon={selectedCon}
              setSelectedCon={setSelectedCon}
            />
          )}
          {mode === "filter" && <div>filter mode</div>}
        </div>
      </div>

      {selectedCon && (
        <DetailsPanel con={selectedCon} onClose={() => setSelectedCon(null)} />
      )}
    </div>
  );
}
