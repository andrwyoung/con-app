// the expandable scrollable list that shows cards
// responsible for any keybaord navigation interactions too

import { useScopedSelectedCardsStore } from "@/stores/sidebar-store";
import { ConLocation, ConventionInfo, Scope } from "@/types/types";
import React, { useEffect, useRef } from "react";
import { CardVariant } from "../card";
import { useMapStore } from "@/stores/map-store";
import { useModalUIStore } from "@/stores/ui-store";
import { MAX_CARDS } from "@/lib/constants";

import { FlatCardList } from "./grouped-card-list";
import { useSortedAndGrouped } from "@/hooks/use-sorted-cards";
import { useCardListKeyboardNav } from "@/hooks/use-card-list-keyboard";
import { SortType } from "@/types/search-types";

export default function CardList({
  items,
  sortOption = "raw",
  currentLocation = null,
  userLocation,
  type = "default",
  scope,
}: {
  items: ConventionInfo[];
  sortOption?: SortType;
  currentLocation?: ConLocation | null;
  userLocation?: ConLocation;
  type?: CardVariant;
  scope: Scope;
}) {
  const { setSelectedCon, selectedCon, selectedIndex, setSelectedIndex } =
    useScopedSelectedCardsStore(scope);
  const flyTo = useMapStore((s) => s.flyTo);

  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const anyModalOpen = useModalUIStore((s) => s.anyModalOpen());

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
