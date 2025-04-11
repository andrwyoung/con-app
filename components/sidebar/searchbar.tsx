import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { EventInfo } from "@/types/types";
import { useDebouncedCallback } from "use-debounce";
import { DROPDOWN_RESULTS, SPECIAL_CON_ID } from "@/lib/constants";
import { FiMapPin, FiUser, FiX } from "react-icons/fi";
import {
  useSearchStore,
  useSidebarStore,
} from "@/stores/explore-sidebar-store";
import { useEventStore } from "@/stores/all-events-store";

type DropdownItem = {
  id: string;
  type: "result" | "action" | "message";
  label: React.ReactNode;
  data?: EventInfo;
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
  const [suggestionResults, setSuggestionResults] = useState<EventInfo[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const items: DropdownItem[] = [];

  const { allEvents } = useEventStore();
  const { setSidebarModeAndDeselectCon } = useSidebarStore();
  const { setResults } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const clearSearchBar = () => {
    setHighlightedIndex(-1);
    setSuggestionResults([]);
    setShowDropdown(false);
    setSearchbarText("");
  };

  const grabConventions = (text: string) => {
    return Object.values(allEvents).filter((event) =>
      event.name.toLowerCase().includes(text.toLowerCase())
    );
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

  const handleDropdownSuggestionItems = useDebouncedCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSuggestionResults([]);
        return;
      }

      const res = grabConventions(searchbarText);
      console.log(res);

      if (res.length === 0) {
        setSuggestionResults([
          {
            id: SPECIAL_CON_ID.NO_RESULTS,
            name: `No results for "${searchbarText}"`,
            latitude: 0,
            longitude: 0,
          } as EventInfo,
        ]);
      } else {
        setSuggestionResults(res);
      }
    },
    300
  );

  // SECTION: handlers
  //

  // when they want to see all results
  const onShowAllItems = (e: React.FormEvent) => {
    e.preventDefault();
    runFullSearch();
  };
  const runFullSearch = async () => {
    if (!searchbarText.trim()) return;

    const res = grabConventions(searchbarText);

    setResults(res);
    setHighlightedIndex(-1);
    setShowDropdown(false);
    setSidebarModeAndDeselectCon("search");

    // ux decision
    if (res.length != 0) {
      inputRef.current?.blur();
    }
  };

  // if an event is selected on the search bar
  const onResultSelect = (s: EventInfo) => {
    if (s.id === -1) return; // should never happen
    setHighlightedIndex(-1);
    setSuggestionResults([]);

    setSidebarModeAndDeselectCon("search");
    setSearchbarText(s.name);
    setResults([s]); // Sidebar will fly if it's just 1
  };

  // TODO these. remember to add setIsSearchMode
  const onSearchHere = () => console.log("TODO: search current location");
  const onSearchNearMe = () => console.log("TODO: search near me");

  // SECTION: keyboard controls
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

  // SECTION: here we build the dropdown list
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
        label: res.name,
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
        <ul className="absolute z-20 bg-white shadow-md text-sm w-full mt-1 rounded max-h-64 overflow-y-auto">
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
