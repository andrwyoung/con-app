"use client";
import DetailsPanel from "@/components/details-panel/details-panel";
import ListPanel from "@/components/list-panel/list-panel";
import {
  usePlanSelectedCardsStore,
  usePlanSidebarStore,
} from "@/stores/sidebar-store";
import React, { useEffect, useRef } from "react";
import SearchBar from "../../components/sidebar-panel/searchbar";
import SearchMode from "@/components/sidebar-panel/modes/search-mode";
import { usePlanSearchStore } from "@/stores/search-store";
import CalendarMode from "@/components/sidebar-panel/modes/calendar-mode";
import Calendar from "./calendar";
import DragContextWrapper from "@/components/sidebar-panel/drag-context-wrapper";

export default function PlanPage() {
  const selectedCon = usePlanSelectedCardsStore((s) => s.selectedCon);
  const setSelectedCon = usePlanSelectedCardsStore((s) => s.setSelectedCon);

  const searchState = usePlanSearchStore((s) => s.searchState);

  const sidebarMode = usePlanSidebarStore((s) => s.sidebarMode);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // scrolling = horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      // don't allow scroll when over panels
      if (target.closest(".disable-scroll-override")) {
        return;
      }

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: "smooth" });
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // if there's a search then set mode to search
  useEffect(() => {
    if (searchState.context) {
      usePlanSidebarStore.getState().setSidebarMode("search");
    } else {
      usePlanSidebarStore.getState().setSidebarMode("calendar");
    }
  }, [searchState.context]);

  return (
    <DragContextWrapper scope={"plan"}>
      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto w-full pt-32 px-24 h-screen scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent"
        >
          <div className="flex justify-center items-start min-w-[max-content] gap-8">
            <div className="relative flex-shrink-0 disable-scroll-override border rounded-lg shadow-lg px-5 py-6 w-86 bg-white">
              <ListPanel scope="plan" />
            </div>
            <div className="flex-shrink-0 disable-scroll-override mr-12">
              <Calendar />
            </div>

            <div className="flex-shrink-0 disable-scroll-override flex gap-2 flex-col border rounded-lg shadow-lg w-86 max-h-[calc(100vh-12rem)] bg-white px-5 py-6">
              <SearchBar key={sidebarMode} scope={"plan"} />
              {/* <StatusDotTester /> */}
              {sidebarMode === "search" && <SearchMode scope="plan" />}
              {sidebarMode === "calendar" && <CalendarMode />}
            </div>

            {selectedCon && (
              <div className="flex-shrink-0 disable-scroll-override">
                <DetailsPanel
                  con={selectedCon}
                  onClose={() => setSelectedCon(null)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-8" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-8" />
      </div>
    </DragContextWrapper>
  );
}
