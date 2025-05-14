"use client";
import Sidebar from "@/app/explore/sidebar";
import { useEffect, useState } from "react";
import { useMapStore } from "@/stores/map-store";
import { useModalUIStore } from "@/stores/ui-store";
import DetailsPanel from "@/components/details-panel/details-panel";
import { useSearchParams } from "next/navigation";
import { getBrowserLocation } from "@/lib/map/get-initial-location";
import { useExploreSelectedCardsStore } from "@/stores/page-store";
import { log } from "@/lib/utils";
import PanelBackground from "@/components/sidebar-background";
import MobileDrawer2 from "./mobile-drawer2";
import { IoLocate } from "react-icons/io5";
import { DEFAULT_ZOOM } from "@/lib/constants";

export default function ExplorePage() {
  const { selectedCon, setSelectedCon, clearSelectedEvents } =
    useExploreSelectedCardsStore.getState();

  const isModalOpen = useModalUIStore((state) => state.anyModalOpen());
  const searchParams = useSearchParams();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // if url says /explore?login=true
    const showLogin = searchParams.get("login") === "true";
    if (showLogin) {
      useModalUIStore.getState().setLoginModalStep("email");
    }
  }, [searchParams]);

  // keyboard shortcuts
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      if (isModalOpen) return; // important to check if modal is open

      // const active = document.activeElement;
      // const isInputFocused =
      //   active instanceof HTMLElement &&
      //   active.matches("input, textarea, [contenteditable='true']");

      // if (e.key === "Escape") {
      //   if (isInputFocused) return;

      //   const { selectedCon, setSelectedCon } =
      //     useExploreSelectedCardsStore.getState();
      //   const { sidebarMode } = useExploreSidebarStore.getState();

      //   log("escape pressed! selected con:", selectedCon);

      //   // 1st escape deselects con
      //   // 2nd escape changes mode back to filter
      //   if (selectedCon) {
      //     setSelectedCon(null);
      //     useMapStore.getState().clearSelectedPointHighlight?.();
      //   } else if (sidebarMode === "filter") {
      //     clearSelectedEvents();
      //     useMapStore.getState().clearClickedClusterHighlight?.();
      //   } else {
      //     useExploreSearchStore.getState().setSearchState(null);
      //   }
      // }

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

  const handleLocate = async () => {
    log("coords hey");
    try {
      const coords = await getBrowserLocation(); // triggers permission
      if (!coords) return;

      const { flyTo, setUserLocation } = useMapStore.getState();

      setUserLocation(coords);
      log("coords", coords);

      flyTo?.(coords, DEFAULT_ZOOM);
    } catch (err) {
      console.error("Location access denied or failed", err);
    }
  };

  return (
    <div className="w-screen h-screen-dvh font-extrabold relative">
      <div className="absolute z-8 top-0 left-0 md:top-[12%] md:left-[2%]">
        <Sidebar />
      </div>
      <div className="hidden md:block">
        {hasMounted && selectedCon && (
          <div className="absolute right-[2%] top-[13%] z-5">
            <div className="relative">
              <PanelBackground />
              <div className="w-96 max-h-[calc(100dvh-10rem)] bg-white rounded-lg shadow-xl border flex flex-col">
                <DetailsPanel
                  scope="explore"
                  conId={selectedCon.id}
                  conName={selectedCon.name}
                  onClose={() => setSelectedCon(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="block md:hidden absolute bottom-0 right-0 w-screen z-6">
        {/* <Toggler /> */}
        <PanelBackground />
        <div className="h-12 w-full flex items-center justify-center bg-white rounded-lg text-xs text-primary-text">
          Mobile Experience is Limited. Try Desktop!
        </div>
      </div>

      {typeof window !== "undefined" && window.innerWidth < 768 && (
        <div className="flex md:hidden z-20 flex-col h-full">
          <MobileDrawer2 />
        </div>
      )}
      <div className="absolute bottom-10 right-8 z-50">
        <button
          onClick={handleLocate}
          className="hidden md:block bg-white text-primary-text p-2 rounded-lg 
          shadow-lg hover:bg-primary-light transition-colors cursor-pointer"
        >
          <IoLocate />
        </button>
        <PanelBackground />
      </div>
    </div>
  );
}
