import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useMapStore } from "@/stores/map-store";
import { searchConventions } from "@/lib/searching/search-conventions";
import { ConLocation, EventInfo } from "@/types/types";
import { useDebouncedCallback } from "use-debounce";
import { MAX_SEARCH_RESULTS, SPECIAL_CON_ID } from "@/lib/constants";
import { FiX } from "react-icons/fi";

export default function Searchbar({
  setSidebarResults,
}: {
  setSidebarResults: (s: EventInfo[]) => void;
}) {
  const [searchbarText, setSearchbarText] = useState("");
  const [suggestionResults, setSuggestionResults] = useState<EventInfo[]>([]);
  const [showDropdown, setDropdown] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const totalOptions =
    suggestionResults.length +
    (suggestionResults.length >= MAX_SEARCH_RESULTS ? 1 : 0);
  const flyTo = useMapStore((s) => s.flyTo);

  const clearSearch = () => {
    setSearchbarText("");
    setHighlightedIndex(-1);
    setSuggestionResults([]);
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
        setDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // when there is no single convention selected
  // we want to pass the results up to sidebar for it to show results
  const handleFinalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchbarText.trim()) return; // do nothing if empty search

    const res = await searchConventions(searchbarText);
    setHighlightedIndex(-1);
    setSidebarResults(res); // pass back search results to Sidebar
    setSuggestionResults([]);
    if (flyTo) flyTo({ latitude: -30, longitude: 100 }, 5);
  };

  // if an event is selected on the search bar
  // then we want to just fly immediately to it
  // TODO: we should probably show more info. where?
  const handleDropdownEnter = (s: EventInfo) => {
    if (s.id === -1) return;
    setHighlightedIndex(-1);
    setSearchbarText(s.name);
    console.log("flying to:", s);
    flyTo?.({ latitude: s.latitude, longitude: s.longitude }, 10);
    setSuggestionResults([]);
  };

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

  // keyboard controls
  const handleKeyBoardControls = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      if (highlightedIndex < 0) {
        // don't highlight "No results found"
        if (suggestionResults.length && suggestionResults[0].id !== -1) {
          setHighlightedIndex(0);
        }
      } else {
        setHighlightedIndex((prev) => Math.min(prev + 1, totalOptions - 1));
      }
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev <= 0 ? -1 : Math.max(prev - 1, 0)));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();

      if (
        suggestionResults.length >= MAX_SEARCH_RESULTS &&
        highlightedIndex === suggestionResults.length
      ) {
        // if "See all results" then use Final Search
        handleFinalSearch(new Event("submit") as unknown as React.FormEvent);
      } else {
        // else it is a
        handleDropdownEnter(suggestionResults[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      clearSearch();
    }
  };

  return (
    <form onSubmit={handleFinalSearch} ref={wrapperRef}>
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
            if (suggestionResults.length > 0) setDropdown(true);
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

      {suggestionResults.length > 0 && showDropdown && (
        <ul className="z-20 bg-white shadow-md text-sm w-full mt-1 rounded max-h-64 overflow-y-auto">
          {suggestionResults.map((s, i) => (
            <li
              key={s.id}
              className={`px-4 py-2 truncate 
                ${highlightedIndex === i ? "bg-primary-lightest" : ""}
                ${
                  s.id === SPECIAL_CON_ID.NO_RESULTS
                    ? "text-primary-muted cursor-default"
                    : "cursor-pointer"
                }`}
              onClick={() => {
                handleDropdownEnter(s);
              }}
              onMouseEnter={() => setHighlightedIndex(i)}
            >
              {s.name}
            </li>
          ))}

          {suggestionResults.length >= MAX_SEARCH_RESULTS && (
            <li
              className={`px-4 py-2 text-primary-muted hover:underline cursor-pointer font-medium ${
                highlightedIndex === suggestionResults.length
                  ? "bg-primary-lightest"
                  : ""
              }`}
              onClick={() =>
                handleFinalSearch({
                  preventDefault: () => {},
                } as React.FormEvent)
              }
              onMouseEnter={() => setHighlightedIndex(suggestionResults.length)}
            >
              See all results
            </li>
          )}
        </ul>
      )}
    </form>
  );
}
