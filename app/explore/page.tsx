"use client";
import Sidebar from "@/app/explore/sidebar";
import { useEffect, useState } from "react";
import { useMapStore } from "@/stores/map-store";
import { useModalUIStore } from "@/stores/ui-store";
import DetailsPanel from "@/components/details-panel/details-panel";
import { useSearchParams } from "next/navigation";
import { useExploreSearchStore } from "@/stores/search-store";
import {
  useExploreSelectedCardsStore,
  useExploreSidebarStore,
} from "@/stores/page-store";
import { log } from "@/lib/utils";
import SidebarBackground from "@/components/sidebar-background";
import Toggler from "@/components/navbar/toggler";
import MobileDrawer from "./mobile-drawer";

export default function ExplorePage() {
  const { selectedCon, setSelectedCon, clearSelectedEvents } =
    useExploreSelectedCardsStore.getState();

  const isModalOpen = useModalUIStore.getState().anyModalOpen();
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
      if (e.key === "Escape") {
        const active = document.activeElement;
        const isInputFocused =
          active &&
          (active.tagName === "INPUT" || active.tagName === "TEXTAREA");

        if (isInputFocused) return;

        const { selectedCon, setSelectedCon } =
          useExploreSelectedCardsStore.getState();
        const { sidebarMode } = useExploreSidebarStore.getState();

        log("escape pressed! selected con:", selectedCon);

        // 1st escape deselects con
        // 2nd escape changes mode back to filter
        if (selectedCon) {
          setSelectedCon(null);
          useMapStore.getState().clearSelectedPointHighlight?.();
        } else if (sidebarMode === "filter") {
          clearSelectedEvents();
          useMapStore.getState().clearClickedClusterHighlight?.();
        } else {
          useExploreSearchStore.getState().setSearchState(null);
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
    <div className="w-screen h-screen-dvh font-extrabold relative">
      <div className="absolute z-8 top-0 left-0 md:top-[13%] md:left-[2%]">
        <Sidebar />
      </div>
      <div className="hidden md:block">
        {hasMounted && selectedCon && (
          <div className="absolute right-[2%] top-[13%] z-5">
            <div className="relative">
              <SidebarBackground />
              <div className="w-96 max-h-[calc(100dvh-10rem)] bg-white rounded-lg shadow-xl border flex flex-col">
                <DetailsPanel
                  scope="explore"
                  con={selectedCon}
                  onClose={() => setSelectedCon(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="block md:hidden absolute bottom-0 right-0 w-screen z-6">
        <Toggler />
      </div>

      <div className="flex md:hidden z-20 flex-col h-full">
        <MobileDrawer />
      </div>
    </div>
  );
}
