import React, { useEffect } from "react";
import SearchBar from "./searchbar";
import DetailsPanel from "./details-panel";
import SearchMode from "./modes/search-mode";
import { useSidebarStore } from "@/stores/explore-sidebar-store";
import MapMode from "./modes/map-mode";

export type sidebarModes = "search" | "filter" | "map";

export default function Sidebar() {
  const { sidebarMode: mode, setSelectedCon, selectedCon } = useSidebarStore();

  useEffect(() => {
    if (mode !== "search") {
      setSelectedCon(null);
    }
  }, [mode]);

  return (
    <div className="absolute z-10 top-36 left-8">
      <div className="flex flex-col gap-2 w-80 max-h-180 h-full rounded-lg shadow-lg bg-white px-5 py-6">
        <SearchBar />
        {mode === "search" && (
          <SearchMode
            selectedCon={selectedCon}
            setSelectedCon={setSelectedCon}
          />
        )}
        {mode === "filter" && <div>filter mode</div>}
        {mode === "map" && <MapMode />}
      </div>

      {selectedCon && (
        <DetailsPanel con={selectedCon} onClose={() => setSelectedCon(null)} />
      )}
    </div>
  );
}
