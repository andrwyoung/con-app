import {
  useMapCardsStore,
  useSidebarStore,
} from "@/stores/explore-sidebar-store";
import React from "react";
import Card from "../card";
import CardWrapper from "../card-wrapper";
import ModeWrapper from "./mode-wrapper";

export default function MapMode() {
  const { focusedEvents } = useMapCardsStore();
  const { selectedCon, setSelectedCon } = useSidebarStore();
  return (
    <ModeWrapper title="Map Select">
      <CardWrapper>
        {focusedEvents.map((con, i) => (
          <Card
            key={con.id || i}
            info={con}
            selected={selectedCon?.id === con.id}
            onClick={() =>
              setSelectedCon(selectedCon?.id === con.id ? null : con)
            }
          />
        ))}
      </CardWrapper>
    </ModeWrapper>
  );
}
