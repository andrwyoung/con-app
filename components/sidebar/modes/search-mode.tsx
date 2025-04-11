import {
  useSearchStore,
  useSidebarStore,
} from "@/stores/explore-sidebar-store";
import { useEffect } from "react";
import { MAX_CARDS, ZOOM_USE_DEFAULT } from "@/lib/constants";
import { useMapStore } from "@/stores/map-store";
import NavigatableCardList from "../card-wrapper";
import ModeWrapper from "./mode-wrapper";

export default function SearchMode() {
  const { results } = useSearchStore();
  const { setSelectedCon } = useSidebarStore();
  const flyTo = useMapStore((s) => s.flyTo);

  // process the results of a search
  useEffect(() => {
    const loc = results.at(0);
    if (!loc) return;

    console.log("searchbar results: ", results);

    if (
      results.length === 1 &&
      loc.latitude !== undefined &&
      loc.longitude !== undefined
    ) {
      setSelectedCon(loc);
      flyTo?.(
        { latitude: loc.latitude, longitude: loc.longitude },
        ZOOM_USE_DEFAULT
      );
    } else if (results.length > 1) {
      // flyTo?.(DEFAULT_LOCATION);
      console.log("search resulted in more than 1 entry. nice");
    }
  }, [results, flyTo, setSelectedCon]);

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
