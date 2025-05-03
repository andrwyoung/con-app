"use client";
import DetailsPanel from "@/components/details-panel/details-panel";
import ListPanel from "@/components/list-panel/list-panel";
import {
  usePlanSelectedCardsStore,
  usePlanSidebarStore,
} from "@/stores/page-store";
import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/sidebar-panel/searchbar";
import SearchMode from "@/components/sidebar-panel/modes/search-mode";
import { usePlanSearchStore } from "@/stores/search-store";
import CalendarMode from "@/components/sidebar-panel/modes/calendar-mode";
import DragContextWrapper from "@/components/sidebar-panel/drag-context-wrapper";
import Caly from "./caly";
import { IoCaretBack } from "react-icons/io5";
import { usePlanGeneralUIStore } from "@/stores/ui-store";
import { AnimatePresence, motion } from "framer-motion";
import SidebarToggleButton from "@/components/list-panel/toggle-button";

function ScrollButton({
  direction,
  scrollRef,
  disabled,
}: {
  direction: "left" | "right";
  scrollRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}) {
  const isLeft = direction === "left";

  return (
    <button
      onClick={() => {
        if (disabled) return;
        scrollRef.current?.scrollBy({
          left: isLeft ? -400 : 400,
          behavior: "smooth",
        });
      }}
      disabled={disabled}
      className={`bg-white cursor-pointer border-gray-300 rounded-full p-2 hover:scale-105 text-primary-text transition-transform ${
        isLeft ? "" : "rotate-180"
      } ${
        disabled
          ? "opacity-40 cursor-default hover:scale-100"
          : "hover:bg-primary-lightest"
      }`}
    >
      <IoCaretBack className="w-6 h-6" />
    </button>
  );
}

export default function PlanPage() {
  const selectedCon = usePlanSelectedCardsStore((s) => s.selectedCon);
  const setSelectedCon = usePlanSelectedCardsStore((s) => s.setSelectedCon);

  const searchState = usePlanSearchStore((s) => s.searchState);
  const { showListPanel, setShowListPanel } = usePlanGeneralUIStore();

  const sidebarMode = usePlanSidebarStore((s) => s.sidebarMode);
  const [canScroll, setCanScroll] = useState(false);
  const [atScrollStart, setAtScrollStart] = useState(true);
  const [atScrollEnd, setAtScrollEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const sidebarRef = useRef<HTMLDivElement | null>(null); // for Caly to scroll to the sidebar
  const detailsRef = useRef<HTMLDivElement | null>(null); // for sidebar to scroll to details panel

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollable = el.scrollWidth > el.clientWidth;
    const atStart = el.scrollLeft <= 0;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    setCanScroll((prev) => (prev !== scrollable ? scrollable : prev));
    setAtScrollStart((prev) => (prev !== atStart ? atStart : prev));
    setAtScrollEnd((prev) => (prev !== atEnd ? atEnd : prev));
  }, []);

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

    el.addEventListener("scroll", checkScroll);
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", checkScroll);
    checkScroll(); // initial check on mount

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  useEffect(() => {
    checkScroll();

    detailsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedCon, checkScroll, detailsRef]);

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
        {canScroll && (
          <div className="hidden md:flex absolute bottom-8 shadow-lg rounded-lg p-2 bg-white border border-muted left-1/2 -translate-x-1/2 z-15 gap-4">
            <ScrollButton
              direction="left"
              scrollRef={scrollRef}
              disabled={atScrollStart}
            />
            <h3 className="text-sm self-center text-primary-text font-semibold uppercase">
              Scroll
            </h3>
            <ScrollButton
              direction="right"
              scrollRef={scrollRef}
              disabled={atScrollEnd}
            />
          </div>
        )}

        <div
          ref={scrollRef}
          className="overflow-x-auto w-full pt-8 md:pt-30 px-6 sm:px-12 md:px-24 h-screen-dvh scrollbar-track-transparent"
        >
          <motion.div className="flex justify-center items-start min-w-[max-content] gap-8 mx-0 md:mx-12 max-h-screen-dvh  md:max-h-[calc(100dvh-20rem)]">
            <div className="flex-shrink-0 disable-scroll-override mr-8 ">
              <Caly sidebarRef={sidebarRef} />
            </div>

            <div
              ref={sidebarRef}
              className={`relative flex-shrink-0 disable-scroll-override flex gap-2 flex-col border rounded-lg 
                shadow-lg w-86 max-h-[calc(100dvh-7rem)] md:max-h-[calc(100dvh-14rem)] px-5 py-6 bg-white z-10
              ${sidebarMode === "search" ? "outline-2 outline-primary" : ""}`}
            >
              <SearchBar key={sidebarMode} scope={"plan"} />
              {/* <StatusDotTester /> */}
              {sidebarMode === "search" && <SearchMode scope="plan" />}
              {sidebarMode === "calendar" && <CalendarMode />}

              {!showListPanel && (
                <SidebarToggleButton
                  title="Open List Panel"
                  onClick={() => setShowListPanel(true)}
                />
              )}
            </div>

            <AnimatePresence initial={false}>
              {showListPanel && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: { duration: 0.5, ease: "easeOut" },
                  }}
                  exit={{
                    x: -50,
                    opacity: 0,
                    transition: { duration: 0.25, ease: "easeIn" },
                  }}
                >
                  <div className="relative flex-shrink-0 flex flex-col disable-scroll-override border rounded-lg shadow-lg px-5 py-6 w-86 bg-white">
                    <ListPanel scope="plan" />
                    <SidebarToggleButton
                      title="Close List Panel"
                      onClick={() => setShowListPanel(false)}
                      direction="left"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {selectedCon && (
              <div className="flex-shrink-0 disable-scroll-override ml-8">
                <div
                  ref={detailsRef}
                  className="w-96 max-h-[calc(100dvh-7rem)] md:max-h-[calc(100dvh-10rem)] bg-white rounded-lg shadow-xl border flex flex-col pt-6 md:pt-0"
                >
                  <DetailsPanel
                    scope="plan"
                    conId={selectedCon.id}
                    conName={selectedCon.name}
                    onClose={() => setSelectedCon(null)}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
        <div className="hidden md:block pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-8" />
        <div className="hidden md:block pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-8" />

        {/* <div className="block md:hidden absolute bottom-0 right-0 w-screen z-6">
          <Toggler />
        </div> */}
      </div>
    </DragContextWrapper>
  );
}
