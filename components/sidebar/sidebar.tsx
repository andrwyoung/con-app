import React, { useEffect, useState } from "react";
import SearchBar from "./searchbar";
import { EventInfo } from "@/types/types";
import { useMapStore } from "@/stores/map-store";
import { DEFAULT_LOCATION } from "@/lib/constants";
import Card from "./card";
import { FiX } from "react-icons/fi";

export default function Sidebar() {
  const [searchRes, setSearchRes] = useState<EventInfo[]>([]);
  // const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedCon, setSelectedCon] = useState<EventInfo | null>(null);
  const flyTo = useMapStore((s) => s.flyTo);

  // when search finishes
  useEffect(() => {
    const loc = searchRes.at(0);
    if (!loc) return;

    // if only single result, then fly to it
    if (
      searchRes.length === 1 &&
      loc.latitude !== undefined &&
      loc.longitude !== undefined
    ) {
      flyTo?.({ latitude: loc.latitude, longitude: loc.longitude }, 10);
    } else if (searchRes.length > 1) {
      // if more than 1 result then just show list
      // TODO: it's just flying to SF rn
      flyTo?.(DEFAULT_LOCATION, 5);
    }
  }, [searchRes, flyTo]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const active = document.activeElement;
        const isInputFocused =
          active &&
          (active.tagName === "INPUT" || active.tagName === "TEXTAREA");

        if (!isInputFocused) {
          setSelectedCon(null);
        }
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="absolute z-10 top-36 left-8">
      <div className="flex flex-col gap-4 w-80 max-h-180 h-full rounded-lg shadow-lg bg-white px-5 py-6">
        <SearchBar setSidebarResults={setSearchRes} />
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
          <div className="flex flex-col gap-3 pr-1 m-1">
            {searchRes.map((con, i) => (
              <Card
                key={con.id || i}
                info={con}
                selected={selectedCon?.id === con.id}
                onClick={() => {
                  if (selectedCon?.id === con.id) {
                    setSelectedCon(null); // Deselect if already selected
                  } else {
                    setSelectedCon(con);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedCon && (
        <div className="absolute left-[22rem] top-12 w-80  max-h-180 bg-white rounded-lg shadow-lg z-17">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600 hover:scale-105"
            onClick={() => setSelectedCon(null)}
            aria-label="close details panel"
          >
            <FiX />
          </button>
          <div className="flex flex-col px-4 pt-8 pb-6 gap-8">
            <h2 className="text-2xl font-semibold">{selectedCon.name}</h2>
            <div className="flex flex-col">
              <p className="text-xs text-primary-muted">{selectedCon.date}</p>
              <p className="text-sm mt-2">{selectedCon.venue}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
