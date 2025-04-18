// the expandable scrollable list that shows cards
// responsible for any keybaord navigation interactions too

import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { ConLocation, ConventionInfo } from "@/types/types";
import React, { useEffect, useRef } from "react";
import { CardVariant } from "../card";
import { useMapStore } from "@/stores/map-store";
import { useUIStore } from "@/stores/ui-store";
import { MAX_CARDS } from "@/lib/constants";
import { SortType } from "@/lib/helpers/sort-cons";

import { FlatCardList } from "./grouped-card-list";
import { useSortedAndGrouped } from "@/hooks/use-sorted-cards";
import { useCardListKeyboardNav } from "@/hooks/use-card-list-keyboard";

export default function CardList({
  items,
  sortOption = "raw",
  currentLocation = null,
  type = "default",
}: {
  items: ConventionInfo[];
  sortOption?: SortType;
  currentLocation?: ConLocation | null;
  type?: CardVariant;
}) {
  const { setSelectedCon, selectedCon } = useSidebarStore();
  const flyTo = useMapStore((s) => s.flyTo);

  const selectedIndex = useSidebarStore((s) => s.selectedIndex);
  const setSelectedIndex = useSidebarStore((s) => s.setSelectedIndex);
  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const anyModalOpen = useUIStore((s) => s.anyModalOpen());

  const { userLocation } = useMapStore();

  // build out the sorted results
  const { flattened } = useSortedAndGrouped({
    items,
    sortOption,
    userLocation: userLocation ?? undefined,
    currentLocation: currentLocation ?? undefined,
  });

  // initialize refs for all cards for scrolling into view
  useEffect(() => {
    cardRefs.current = Array.from(
      { length: flattened.length },
      (_, i) => cardRefs.current[i] || React.createRef()
    );
  }, [flattened]);

  // keyboard nav
  useCardListKeyboardNav({
    flattened,
    selectedIndex,
    selectedCon,
    setSelectedCon,
    setSelectedIndex,
    cardRefs: cardRefs.current,
    flyTo,
    anyModalOpen,
  });

  // reset index when list changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [items, sortOption, setSelectedIndex]);

  return (
    <div className="flex flex-col">
      <FlatCardList
        items={flattened}
        selectedCon={selectedCon}
        setSelectedCon={setSelectedCon}
        setSelectedIndex={setSelectedIndex}
        cardRefs={cardRefs.current}
        type={type}
      />
      {items.length > MAX_CARDS && (
        <p className="text-sm text-primary-muted self-center mt-2">
          Only showing {MAX_CARDS} results
        </p>
      )}
    </div>
  );
}
