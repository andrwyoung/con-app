import { useMapCardsStore } from "@/stores/explore-sidebar-store";
import React from "react";
import NavigatableCardList from "../card-wrapper";
import ModeWrapper from "./mode-wrapper";

export default function MapMode() {
  const { focusedEvents } = useMapCardsStore();
  return (
    <ModeWrapper title="Map Select">
      <NavigatableCardList items={focusedEvents} />
    </ModeWrapper>
  );
}
