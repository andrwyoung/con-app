import { useExploreSelectedCardsStore } from "@/stores/page-store";
import { useExploreUIStore } from "@/stores/ui-store";
import React, { useEffect, useRef, useState } from "react";
import CardList from "@/components/card/card-list/card-list";
import DetailsPanel from "@/components/details-panel/details-panel";

export type DrawerMode = "closed" | "select" | "details";

export default function MobileDrawer() {
  const { showMobileDrawer, setShowMobileDrawer } = useExploreUIStore();
  const [mode, setMode] = useState<DrawerMode | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [startY, setStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const [startTranslateY, setStartTranslateY] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  const selectedCon = useExploreSelectedCardsStore((s) => s.selectedCon);
  const selectedMapItems = useExploreSelectedCardsStore(
    (s) => s.filteredFocusedEvents
  );
  const clearSelectedEvents = useExploreSelectedCardsStore(
    (s) => s.clearSelectedEvents
  );

  // SECTION: Selecting con behavior
  //
  //

  useEffect(() => {
    if (selectedCon) {
      setMode("details");
      setShowMobileDrawer(true);
    } else if (selectedMapItems.length > 0) {
      setMode("select");
      setShowMobileDrawer(true);
    } else {
      setMode(null);
      setShowMobileDrawer(false);
    }
    setTranslateY(0);
  }, [selectedCon, selectedMapItems, setShowMobileDrawer]);

  // SECTION: closing the drawer behavior
  //
  //

  function handleTouchStart(e: React.TouchEvent) {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartTranslateY(translateY); // remember where we started!
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (startY === null) return;
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    const newTranslateY = startTranslateY + diff;

    if (newTranslateY >= 0) {
      setTranslateY(newTranslateY);
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    setIsDragging(false);

    if (startY === null) return;

    const endY = e.changedTouches[0].clientY;
    const screenHeight = window.innerHeight;

    if (endY > screenHeight * 0.7) {
      clearSelectedEvents();
      setShowMobileDrawer(false); // fully close
      // } else if (endY > screenHeight * 0.5) {
      //   setTranslateY(screenHeight * 0.5);
      //   setIsDragging(true);
    } else {
      setTranslateY(0); // snap fully open
    }

    setStartY(null);
  }

  return (
    <div
      ref={drawerRef}
      className={`flex flex-col touch-none fixed bottom-0 left-0 right-0 z-50 w-full h-[70dvh] rounded-t-lg bg-white shadow-t-lg 
           duration-300 md:hidden  border-t-2 border-primary
          ${isDragging ? "transition-none" : "transition-transform"}
          ${showMobileDrawer ? "translate-y-0" : "translate-y-full"}
        `}
      style={{
        transform: isDragging
          ? `translateY(${translateY}px)`
          : showMobileDrawer
          ? "translateY(0)"
          : "translateY(100%)",
      }}
    >
      <div className="flex flex-col h-full pb-6">
        <div
          className="p-4 w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="mx-auto w-12 h-1 rounded-full bg-gray-300 my-2" />
        </div>
        <div className="flex-1 min-h-0 flex px-2 flex-col overflow-y-auto">
          {mode == "details" && selectedCon && (
            <DetailsPanel
              scope="explore"
              con={selectedCon}
              onClose={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          )}
          {mode == "select" && (
            <CardList
              items={selectedMapItems}
              scope="explore"
              sortOption="status"
            />
          )}
        </div>
      </div>
    </div>
  );
}
