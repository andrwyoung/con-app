import { useMapCardsStore } from "@/stores/explore-sidebar-store";
import React, { useState } from "react";
import NavigatableCardList from "../card-wrapper";
import ModeWrapper, { sortType } from "./mode-wrapper";

export default function MapMode() {
  const { focusedEvents } = useMapCardsStore();
  const [sortOption, setSortOption] = useState<sortType>("chron");

  return (
    <ModeWrapper
      title="Map Select"
      setSortMode={setSortOption}
      numResults={focusedEvents.length}
    >
      <NavigatableCardList items={focusedEvents} sortType={sortOption} />
    </ModeWrapper>
  );
}
