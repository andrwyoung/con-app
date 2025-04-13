import {
  useSearchStore,
  useSidebarStore,
} from "@/stores/explore-sidebar-store";
import { useEffect, useMemo, useState } from "react";
import { ZOOM_USE_DEFAULT } from "@/lib/constants";
import { useMapStore } from "@/stores/map-store";
import NavigatableCardList from "../card-wrapper";
import ModeWrapper from "./mode-wrapper";
import { SortType } from "@/lib/sort-cons";
import { sortEvents } from "@/lib/sort-cons";

const TITLE_DEFAULT = "Search Results";
const TITLE_LOCATION = "Nearby";

export default function SearchMode() {
  const { results } = useSearchStore();
  const { setSelectedCon } = useSidebarStore();
  const { userLocation, getCurrentCenter } = useMapStore();
  const flyTo = useMapStore((s) => s.flyTo);

  const [numResults, setNumResults] = useState(0);
  const [sortOption, setSortOption] = useState<SortType>("chron");

  const [title, setTitle] = useState(TITLE_DEFAULT);

  const [centerOfViewport, setCenterOfViewport] = useState(
    getCurrentCenter?.()
  );

  // process the results of a search
  useEffect(() => {
    const loc = results.at(0);
    setNumResults(results.length);
    if (!loc) return;

    console.log("searchbar results: ", results);

    // if searchbar has a preferred default sort, start with that
    const preferredSort = useSearchStore.getState().sortPreference;
    setCenterOfViewport(getCurrentCenter?.());
    setSortOption(preferredSort);

    if (preferredSort === "distance") {
      setTitle(TITLE_LOCATION);
    } else {
      setTitle(TITLE_DEFAULT);
    }

    if (
      results.length === 1 &&
      loc.latitude !== undefined &&
      loc.longitude !== undefined
    ) {
      flyTo?.(
        { latitude: loc.latitude, longitude: loc.longitude },
        ZOOM_USE_DEFAULT
      );
      setSelectedCon(loc);
    }
  }, [results, flyTo, setSelectedCon, getCurrentCenter]);

  // build out the sorted results
  const sortedResults = useMemo(
    () =>
      sortEvents(
        results,
        sortOption,
        userLocation ?? undefined,
        centerOfViewport ?? undefined
      ),
    [results, sortOption, userLocation, centerOfViewport]
  );

  return (
    <ModeWrapper
      title={title}
      numResults={numResults}
      sortMode={sortOption}
      setSortMode={setSortOption}
    >
      {results.length === 0 ? (
        <div className="text-sm text-center text-primary-muted px-2">
          No results found. <br />
          Try refining your search.
        </div>
      ) : (
        <NavigatableCardList items={sortedResults} />
      )}
    </ModeWrapper>
  );
}
