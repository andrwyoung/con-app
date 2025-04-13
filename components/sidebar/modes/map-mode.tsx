import { useMapCardsStore } from "@/stores/explore-sidebar-store";
import React, { useEffect, useMemo, useState } from "react";
import NavigatableCardList from "../card-wrapper";
import ModeWrapper from "./mode-wrapper";
import { sortEvents, SortType } from "@/lib/sort-cons";

const MAPMODE_DEFAULT_SORT = "chron";

export default function MapMode() {
  const { focusedEvents } = useMapCardsStore();
  const [sortOption, setSortOption] = useState<SortType>(MAPMODE_DEFAULT_SORT);

  useEffect(() => {
    setSortOption(MAPMODE_DEFAULT_SORT);
  }, [focusedEvents]);

  // build out the sorted results
  const sortedFocusedEvents = useMemo(
    () => sortEvents(focusedEvents, sortOption),
    [focusedEvents, sortOption]
  );

  return (
    <ModeWrapper
      title="Map Select"
      sortMode={sortOption}
      setSortMode={setSortOption}
      numResults={focusedEvents.length}
    >
      <NavigatableCardList items={sortedFocusedEvents} />
    </ModeWrapper>
  );
}
