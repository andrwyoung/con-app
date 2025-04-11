import { EventInfo } from "@/types/types";
import Card from "../card";
import { useSearchStore } from "@/stores/explore-sidebar-store";
import { useEffect } from "react";
import { DEFAULT_LOCATION, MAX_CARDS } from "@/lib/constants";
import { useMapStore } from "@/stores/map-store";
import { Button } from "@/components/ui/button";
import CardWrapper from "../card-wrapper";
import ModeWrapper from "./mode-wrapper";

export default function SearchMode({
  selectedCon,
  setSelectedCon,
}: {
  selectedCon: EventInfo | null;
  setSelectedCon: (c: EventInfo | null) => void;
}) {
  const { results } = useSearchStore();
  const flyTo = useMapStore((s) => s.flyTo);

  // process the results of a search
  useEffect(() => {
    const loc = results.at(0);
    if (!loc) return;

    if (
      results.length === 1 &&
      loc.latitude !== undefined &&
      loc.longitude !== undefined
    ) {
      flyTo?.({ latitude: loc.latitude, longitude: loc.longitude }, 10);
    } else if (results.length > 1) {
      flyTo?.(DEFAULT_LOCATION);
    }
  }, [results]);

  return (
    <ModeWrapper title="Search Results">
      {results.length === 0 ? (
        <div className="text-sm text-center text-primary-muted px-2">
          No results found. <br />
          Try refining your search.
        </div>
      ) : (
        <CardWrapper>
          {results.slice(0, MAX_CARDS).map((con, i) => (
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
      )}
    </ModeWrapper>
  );
}
