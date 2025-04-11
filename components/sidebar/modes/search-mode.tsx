import { useSearchStore } from "@/stores/explore-sidebar-store";
import { useEffect } from "react";
import { DEFAULT_LOCATION, MAX_CARDS } from "@/lib/constants";
import { useMapStore } from "@/stores/map-store";
import NavigatableCardList from "../card-wrapper";
import ModeWrapper from "./mode-wrapper";

export default function SearchMode() {
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
        <NavigatableCardList items={results.slice(0, MAX_CARDS)} />
      )}
    </ModeWrapper>
  );
}
