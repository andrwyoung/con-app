import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useMapStore } from "@/stores/map-store";
import { searchConventions } from "@/lib/searching/search-conventions";
import { EventInfo } from "@/types/types";
import { useDebouncedCallback } from "use-debounce";
import { DROPDOWN_RESULTS, SPECIAL_CON_ID } from "@/lib/constants";
import { FiMapPin, FiUser, FiX } from "react-icons/fi";

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

export default function Searchbar({
  setSidebarResults,
}: {
  setSidebarResults: (s: EventInfo[]) => void;
}) {
  const [searchbarText, setSearchbarText] = useState("");
  const [suggestionResults, setSuggestionResults] = useState<EventInfo[]>([]);
  const [showDropdown, setShowDropdown] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const items: DropdownItem[] = [];

  const flyTo = useMapStore((s) => s.flyTo);

  const clearSearch = () => {
    setSearchbarText("");
    setHighlightedIndex(-1);
    setSuggestionResults([]);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  // put cursor into search bar on load
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

      const res = await searchConventions(searchbarText);
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
  const onShowAllItems = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchbarText.trim()) return; // do nothing if empty search

    const res = await searchConventions(searchbarText);
    setHighlightedIndex(-1);
    setSidebarResults(res); // pass back search results to Sidebar
    setSuggestionResults([]);
    if (flyTo) flyTo({ latitude: -30, longitude: 100 }, 5);
  };

  // if an event is selected on the search bar
  const onResultSelect = (s: EventInfo) => {
    if (s.id === -1) return;
    setHighlightedIndex(-1);
    setSearchbarText(s.name);
    console.log("flying to:", s);
    flyTo?.({ latitude: s.latitude, longitude: s.longitude }, 10);
    setSuggestionResults([]);
  };

  // TODO
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
      clearSearch();
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
        onClick: () =>
          onShowAllItems(new Event("submit") as unknown as React.FormEvent),
      });
    }
  }

  return (
    <form onSubmit={onShowAllItems} ref={wrapperRef}>
      <div className="relative">
        <Input
          type="text"
          ref={inputRef}
          value={searchbarText}
          onChange={(e) => {
            setSearchbarText(e.target.value);
            handleDropdownSuggestionItems(e.target.value);
          }}
          onKeyDown={(e) => handleKeyBoardControls(e)}
          placeholder="Search for Conventions"
          onFocus={() => {
            if (items.length > 0) setShowDropdown(true);
            setHighlightedIndex(-1);
          }}
          className="pr-8"
        />
        {searchbarText && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <FiX />
          </button>
        )}
      </div>
      {showDropdown && (
        <ul className="z-20 bg-white shadow-md text-sm w-full mt-1 rounded max-h-64 overflow-y-auto">
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
