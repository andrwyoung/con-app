import { useEffect, useState } from "react";
import { DEFAULT_SORT, ZOOM_USE_DEFAULT } from "@/lib/constants";
import { useMapPinsStore, useMapStore } from "@/stores/map-store";
import CardList from "../../card/card-list/card-list";
import SearchBarWrapper from "./search-wrapper";
import { Scope } from "@/types/types";
import { useScopedSearchStore } from "@/stores/search-store";
import { useScopedSelectedCardsStore } from "@/stores/page-store";
import { log } from "@/lib/utils";
import { SortType } from "@/types/sort-types";

const TITLE_DEFAULT = "Search Results";

export default function SearchMode({ scope }: { scope: Scope }) {
  const { results, searchState } = useScopedSearchStore(scope);
  const { setSelectedCon } = useScopedSelectedCardsStore(scope);
  const flyTo = useMapStore((s) => s.flyTo);

  const [numResults, setNumResults] = useState(0);
  const [sortOption, setSortOption] = useState<SortType>("raw");

  const [title, setTitle] = useState(TITLE_DEFAULT);

  const setTempPins = useMapPinsStore((s) => s.setTempPins);
  const clearTempPins = useMapPinsStore((s) => s.clearTempPins);

  const userLocation = useMapStore((s) => s.userLocation);
  const currentLocation =
    searchState.context?.type === "near-me" ||
    searchState.context?.type === "current-location"
      ? searchState.context.location
      : undefined;

  // process the results of a search
  useEffect(() => {
    const first_result = results.at(0);
    setNumResults(results.length);
    if (!first_result) return;

    log("searchbar results: ", results);

    // if searchbar has a preferred default sort, start with that
    setSortOption(searchState.context?.sort ?? DEFAULT_SORT);

    if (searchState.context?.type === "current-location") {
      setTitle("Nearby");
      setTempPins(results);
    } else if (searchState.context?.type === "near-me" && userLocation) {
      setTitle("Near Me");
      setTempPins(results);
      flyTo?.(userLocation, ZOOM_USE_DEFAULT);
    } else {
      setTitle(TITLE_DEFAULT);
      clearTempPins();
    }

    // if only 1 result, fly to it
    if (
      results.length === 1 &&
      first_result.location_lat !== undefined &&
      first_result.location_long !== undefined
    ) {
      flyTo?.(
        {
          latitude: first_result.location_lat,
          longitude: first_result.location_long,
        },
        ZOOM_USE_DEFAULT
      );
      setSelectedCon(first_result);
    }
  }, [
    results,
    flyTo,
    setSelectedCon,
    searchState,
    clearTempPins,
    setTempPins,
    userLocation,
  ]);

  return (
    <SearchBarWrapper
      title={title}
      numResults={numResults}
      sortMode={sortOption}
      setSortMode={setSortOption}
      scope={scope}
    >
      {results.length === 0 ? (
        <div className="text-sm text-center text-primary-muted px-2">
          No results found. <br />
          Try refining your search.
        </div>
      ) : (
        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
          <CardList
            items={results}
            currentLocation={currentLocation}
            userLocation={userLocation ?? undefined}
            sortOption={sortOption}
            scope={scope}
          />
        </div>
      )}
    </SearchBarWrapper>
  );
}
