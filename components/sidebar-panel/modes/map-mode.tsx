// DEPRECATED: map mode doesn't exist anymore
// logic has been moved to filter mode
import { useMapCardsStore } from "@/stores/explore-sidebar-store";
import React, { useEffect, useMemo, useState } from "react";
import CardList from "../../card/card-list/card-list";
import ModeWrapper from "./mode-wrapper";
import { sortEvents, SortType } from "@/lib/helpers/sort-cons";

const MAPMODE_DEFAULT_SORT = "raw";

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
      <CardList items={sortedFocusedEvents} />
    </ModeWrapper>
  );
}
