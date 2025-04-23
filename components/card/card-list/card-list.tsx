// the expandable scrollable list that shows cards
import { useScopedSelectedCardsStore } from "@/stores/sidebar-store";
import { ConLocation, ConventionInfo, Scope } from "@/types/types";
import React, { useEffect, useRef } from "react";
import { CardVariant } from "../card";
import { MAX_CARDS } from "@/lib/constants";

import { FlatCardList } from "./grouped-card-list";
import { useSortedAndGrouped } from "@/hooks/use-sorted-cards";
import { SortType } from "@/types/search-types";

export default function CardList<T extends ConventionInfo = ConventionInfo>({
  items,
  sortOption = "raw",
  currentLocation = null,
  userLocation,
  type = "default",
  scope,
}: {
  items: T[];
  sortOption?: SortType;
  currentLocation?: ConLocation | null;
  userLocation?: ConLocation;
  type?: CardVariant;
  scope: Scope;
}) {
  const { setSelectedCon, selectedCon, setSelectedIndex } =
    useScopedSelectedCardsStore(scope);

  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

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

  // DISABLED: keyboard nav got too complicated for multiple lists
  // useCardListKeyboardNav({
  //   flattened,
  //   selectedIndex,
  //   selectedCon,
  //   setSelectedCon,
  //   setSelectedIndex,
  //   cardRefs: cardRefs.current,
  //   flyTo,
  //   anyModalOpen,
  // });

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
