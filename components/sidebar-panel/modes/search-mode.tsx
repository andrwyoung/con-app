import {
  useSearchStore,
  useSidebarStore,
} from "@/stores/explore-sidebar-store";
import { useEffect, useState } from "react";
import { ZOOM_USE_DEFAULT } from "@/lib/constants";
import { useMapStore } from "@/stores/map-store";
import NavigatableCardList from "../../card/card-list";
import ModeWrapper from "./mode-wrapper";
import { SortType } from "@/lib/helpers/sort-cons";

const TITLE_DEFAULT = "Search Results";
const TITLE_LOCATION = "Nearby";

export default function SearchMode() {
  const { results } = useSearchStore();
  const { setSelectedCon } = useSidebarStore();
  const { getCurrentCenter } = useMapStore();
  const flyTo = useMapStore((s) => s.flyTo);

  const [numResults, setNumResults] = useState(0);
  const [sortOption, setSortOption] = useState<SortType>("raw");

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
      loc.location_lat !== undefined &&
      loc.location_long !== undefined
    ) {
      flyTo?.(
        { latitude: loc.location_lat, longitude: loc.location_long },
        ZOOM_USE_DEFAULT
      );
      setSelectedCon(loc);
    }
  }, [results, flyTo, setSelectedCon, getCurrentCenter]);

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
        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
          <NavigatableCardList
            items={results}
            currentLocation={centerOfViewport}
            sortOption={sortOption}
          />
        </div>
      )}
    </ModeWrapper>
  );
}
