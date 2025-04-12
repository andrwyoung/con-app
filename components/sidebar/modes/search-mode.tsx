import {
  useSearchStore,
  useSidebarStore,
} from "@/stores/explore-sidebar-store";
import { useEffect, useState } from "react";
import { ZOOM_USE_DEFAULT } from "@/lib/constants";
import { useMapStore } from "@/stores/map-store";
import NavigatableCardList from "../card-wrapper";
import ModeWrapper, { sortType } from "./mode-wrapper";

export default function SearchMode() {
  const { results } = useSearchStore();
  const { setSelectedCon } = useSidebarStore();
  const flyTo = useMapStore((s) => s.flyTo);

  const [numResults, setNumResults] = useState(0);
  const [sortOption, setSortOption] = useState<sortType>("chron");

  // process the results of a search
  useEffect(() => {
    const loc = results.at(0);
    if (!loc) return;

    console.log("searchbar results: ", results);
    setNumResults(results.length);

    if (
      results.length === 1 &&
      loc.latitude !== undefined &&
      loc.longitude !== undefined
    ) {
      flyTo?.(
        { latitude: loc.latitude, longitude: loc.longitude },
        ZOOM_USE_DEFAULT
      );
    }
    setSelectedCon(loc);
  }, [results, flyTo, setSelectedCon]);

  return (
    <ModeWrapper
      title={`Search Results`}
      numResults={numResults}
      setSortMode={setSortOption}
    >
      {results.length === 0 ? (
        <div className="text-sm text-center text-primary-muted px-2">
          No results found. <br />
          Try refining your search.
        </div>
      ) : (
        <NavigatableCardList items={results} sortType={sortOption} />
      )}
    </ModeWrapper>
  );
}
