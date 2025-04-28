import { useExploreSelectedCardsStore } from "@/stores/page-store";
import { useExploreUIStore } from "@/stores/ui-store";
import React, { useEffect, useRef, useState } from "react";
import CardList from "@/components/card/card-list/card-list";

export type DrawerMode = "closed" | "select" | "details";

export default function MobileDrawer() {
  const { showMobileDrawer, setShowMobileDrawer } = useExploreUIStore();
  const [mode, setMode] = useState<DrawerMode | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [startY, setStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  const selectedCon = useExploreSelectedCardsStore((s) => s.selectedCon);
  const selectedMapItems = useExploreSelectedCardsStore(
    (s) => s.filteredFocusedEvents
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
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (startY === null) return;
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      setTranslateY(diff);
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    setIsDragging(false);

    if (startY === null) return;

    const endY = e.changedTouches[0].clientY;
    const screenHeight = window.innerHeight;

    if (endY > screenHeight * 0.7) {
      setShowMobileDrawer(false); // fully close
    } else if (endY > screenHeight * 0.4) {
      setTranslateY(screenHeight * 0.4); // snap to 40% open
    } else {
      setTranslateY(0); // snap fully open
    }

    setStartY(null);
  }

  return (
    <>
      <div
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 z-50 w-full max-h-[70vh] rounded-t-lg bg-white shadow-t-lg 
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
        <div className="">
          <div
            className="p-4 w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="mx-auto w-12 h-1 rounded-full bg-gray-300 mb-4" />
          </div>
          <div className="flex px-2 flex-col max-h-[calc(70vh-3rem)] overflow-y-auto">
            {mode == "details" && selectedCon?.name}
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
    </>
  );
}
