import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { ConventionInfo } from "@/types/types";
import { useDebouncedCallback } from "use-debounce";
import { DROPDOWN_RESULTS, SPECIAL_CON_ID } from "@/lib/constants";
import { FiClock, FiMapPin, FiUser, FiX } from "react-icons/fi";
import { useSearchStore } from "@/stores/explore-sidebar-store";
import { useEventStore } from "@/stores/all-events-store";
import {
  grabConventions,
  grabNearbyConventions,
} from "@/lib/searching/local-search";
import { useMapStore } from "@/stores/map-store";

type DropdownItem = {
  id: string;
  type: "result" | "action" | "message";
  label: React.ReactNode;
  data?: ConventionInfo;
  className?: string;
  onClick?: () => void;
};

function getDropdownItemClass(item: DropdownItem, isHighlighted: boolean) {
  let base = "px-4 py-2 truncate";

  if (item.type === "message") {
    base += " text-primary-muted cursor-default";
  } else if (item.type === "action") {
    base += " text-primary-muted cursor-pointer";
  } else {
    base += " cursor-pointer";
  }

  if (isHighlighted) {
    base += " bg-primary-lightest";
  }
  return base;
}

export default function Searchbar() {
  const [searchbarText, setSearchbarText] = useState("");
  const [suggestionResults, setSuggestionResults] = useState<ConventionInfo[]>(
    []
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const items: DropdownItem[] = [];

  const { getCurrentCenter } = useMapStore();
  const { allEvents } = useEventStore();
  const { setResults, setSearchState, history, addToHistory } =
    useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const clearSearchBar = () => {
    setHighlightedIndex(-1);
    setSuggestionResults([]);
    setShowDropdown(false);
    setSearchbarText("");
  };

  // if we click out of the search bar, close the suggestions list
  const wrapperRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // when the user types, get results for the dropdown suggestions
  const handleDropdownSuggestionItems = useDebouncedCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSuggestionResults([]);
        return;
      }

      const res = grabConventions(searchbarText, allEvents);
      console.log(res);

      if (res.length === 0) {
        setSuggestionResults([
          {
            id: SPECIAL_CON_ID.NO_RESULTS,
            name: `No results for "${searchbarText}"`,
            location_lat: 0,
            location_long: 0,
          } as ConventionInfo,
        ]);
      } else {
        setSuggestionResults(res);
      }
    },
    300
  );

  // SECTION: handlers when they search. there are 4 options
  // 1: run a full search (either by clicking enter or by clicking "see all results" on dropdown)
  // 2: when they click on an item in the dropdown menu
  // 3: option to search conventions around the user's current viewport
  // 4: option to search conventions near the user
  //
  //

  // 1: run a full search
  const onShowAllItems = (e: React.FormEvent) => {
    e.preventDefault();
    runFullSearch();
  };
  const runFullSearch = async (termOverride?: string) => {
    const term = termOverride ?? searchbarText;
    if (!term.trim()) return;
    console.log("running full search");

    const res = grabConventions(term, allEvents);

    setSearchState({
      type: "typed",
      query: term,
      sort: "status",
    });
    setResults(res);

    // add to history
    if (term.length > 2) addToHistory(term, "typed");

    setHighlightedIndex(-1);
    setShowDropdown(false);

    // ux decision
    if (res.length != 0) {
      inputRef.current?.blur();
    }
  };

  // 2: selected an item on dropdown menu
  const onResultSelect = (s: ConventionInfo) => {
    if (s.id === -1) return; // should never happen...hopefully
    setHighlightedIndex(-1);
    setSuggestionResults([]);

    setSearchState({
      type: "clicked",
      query: s.name,
      sort: "alpha",
    });
    setSearchbarText(s.name);
    addToHistory(s.name, "clicked");

    setResults([s]);
  };

  // 3: search here option
  const onSearchHere = () => {
    const center = getCurrentCenter?.();
    if (!center) {
      console.log("could not locate cons in area");
      return;
    }

    console.log("searching in the area...");
    const res = grabNearbyConventions(
      {
        latitude: center.latitude,
        longitude: center.longitude,
      },
      allEvents
    );
    console.log("searched in area. got:", res);

    setSearchState({
      type: "current-location",
      location: center,
      sort: "status",
    });
    setResults(res);

    setShowDropdown(false);
  };

  // 4: search near me option
  const onSearchNearMe = () => {
    const center = useMapStore.getState().userLocation;
    if (!center) {
      console.log("could not location your location");
      return;
    }
    const res = grabNearbyConventions(
      {
        latitude: center.latitude,
        longitude: center.longitude,
      },
      allEvents
    );

    setSearchState({
      type: "near-me",
      location: center,
      sort: "distance-me",
    });
    setResults(res);

    setShowDropdown(false);
  };

  // SECTION: keyboard controls
  //
  //

  const handleKeyBoardControls = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      if (items.length === 0) return;

      setHighlightedIndex((prev) => {
        if (prev < 0) return 0;
        return Math.min(prev + 1, items.length - 1);
      });
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev <= 0 ? -1 : Math.max(prev - 1, 0)));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      items[highlightedIndex]?.onClick?.();
    } else if (e.key === "Escape") {
      if (searchbarText === "") {
        inputRef.current?.blur();
      }
      clearSearchBar();
    }
  };

  // SECTION: build the dropdown list
  // yes, it could have lived in it's own component....but I didn't want to deal with passing all those props lol
  //
  // here I decided to build a "list" of all the items. including "no results", "search near me" and "see all results" etc.
  // this is because it made it easier to have keyboard navigation and makes it easier to
  // include more options later on like search history. it's just one array you can index through
  //
  //

  const nothingTyped = !searchbarText.trim();
  const nothingFound =
    suggestionResults.length === 1 &&
    suggestionResults[0].id === SPECIAL_CON_ID.NO_RESULTS;
  const tooManyResults =
    suggestionResults.length >= DROPDOWN_RESULTS && !nothingFound;

  const SEARCH_NEAR_ME_ITEM = () => ({
    id: "search-near-me",
    type: "action" as const,
    label: (
      <span className="flex items-center gap-2">
        <FiUser className="text-primary" />
        <span>Search near me</span>
      </span>
    ),
    onClick: onSearchNearMe,
  });
  const SEARCH_NEAR_HERE_ITEM = () => ({
    id: "search-current-location",
    type: "action" as const,
    label: (
      <span className="flex items-center gap-2">
        <FiMapPin className="text-primary" />
        <span>Search current location</span>
      </span>
    ),
    onClick: onSearchHere,
  });

  if (nothingTyped) {
    // recent search history
    history.slice(0, DROPDOWN_RESULTS).forEach((res) => {
      items.push({
        id: `result-${res.term}`,
        type: "result",
        label: (
          <div className="flex flex-row items-center justify-between gap-2 truncate">
            <span className="text-primary-text">{res.term}</span>
            <FiClock className="text-primary-text" />
          </div>
        ),
        onClick: () => {
          setSearchbarText(res.term);
          runFullSearch(res.term);
        },
      });
    });

    items.push(SEARCH_NEAR_HERE_ITEM(), SEARCH_NEAR_ME_ITEM());
  } else if (nothingFound) {
    items.push(
      {
        id: "no-results",
        type: "message",
        label: (
          <span className="flex items-center gap-2">
            {/* <FiX className="text-primary" /> */}
            <span>No results for &quot;{searchbarText}&quot;</span>
          </span>
        ),
      },
      SEARCH_NEAR_HERE_ITEM()
    );
  } else {
    // actual results
    suggestionResults.slice(0, DROPDOWN_RESULTS).forEach((res) => {
      items.push({
        id: `result-${res.id}`,
        type: "result",
        label: (
          <div className="flex flex-col truncate">
            <span className="">{res.name}</span>{" "}
            <span className="text-primary-muted text-xs opacity-50">
              {res.location}
            </span>
          </div>
        ),
        data: res,
        onClick: () => onResultSelect(res),
      });
    });

    if (tooManyResults) {
      items.push({
        id: "see-all",
        type: "action",
        label: "See all results...",
        onClick: runFullSearch,
      });
    }
  }

  return (
    <form onSubmit={onShowAllItems} ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          autoComplete="off"
          type="text"
          ref={inputRef}
          value={searchbarText}
          onChange={(e) => {
            setSearchbarText(e.target.value);
            setShowDropdown(true);
            handleDropdownSuggestionItems(e.target.value);
          }}
          onKeyDown={(e) => handleKeyBoardControls(e)}
          placeholder="Search for Conventions"
          onFocus={() => {
            setShowDropdown(true);
            setHighlightedIndex(-1);
          }}
          className="pr-8"
          id="explore-searchbar"
        />
        {searchbarText && (
          <button
            type="button"
            onClick={() => {
              clearSearchBar();
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
            aria-label="clear search text"
          >
            <FiX />
          </button>
        )}
      </div>
      {showDropdown && (
        <ul
          className="absolute z-20 bg-white shadow-md text-sm w-full mt-1 rounded max-h-96 overflow-y-auto"
          onMouseLeave={() => setHighlightedIndex(-1)}
        >
          {items.map((item, i) => (
            <li
              key={item.id}
              className={getDropdownItemClass(item, highlightedIndex === i)}
              onClick={() => item.onClick?.()}
              onMouseEnter={() => setHighlightedIndex(i)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
