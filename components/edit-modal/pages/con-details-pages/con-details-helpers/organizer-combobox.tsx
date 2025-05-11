"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { supabaseAnon } from "@/lib/supabase/client";
import Fuse from "fuse.js";
import { FiX } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { OrganizerType } from "@/types/con-types";

export default function OrganizerCombobox({
  selectedOrganizer,
  setSelectedOrganizer,
  wikiRef,
}: {
  selectedOrganizer: OrganizerType | null;
  setSelectedOrganizer: (org: OrganizerType | null) => void;
  wikiRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(selectedOrganizer?.name || "");
  const [allOrganizers, setAllOrganizers] = useState<OrganizerType[]>([]);
  const [filtered, setFiltered] = useState<OrganizerType[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchOrganizers = async () => {
      const { data } = await supabaseAnon
        .from("organizers")
        .select("organizer_id, organizer_name")
        .order("organizer_name");

      if (data) {
        const mapped = data.map((org) => ({
          id: org.organizer_id,
          name: org.organizer_name,
        }));
        setAllOrganizers(mapped);
      }
    };
    fetchOrganizers();
  }, []);

  // when searching for cons
  useEffect(() => {
    if (query.trim() === "") {
      setFiltered(allOrganizers);
      return;
    }

    const fuse = new Fuse(allOrganizers, {
      keys: ["name"],
      threshold: 0.3,
    });

    const results = fuse.search(query);
    setFiltered(results.map((r) => r.item));
  }, [query, allOrganizers]);

  const handleSelect = (org: OrganizerType) => {
    setSelectedOrganizer(org);
    setQuery(org.name);
    setDropdownOpen(false);
  };

  return (
    <div className="relative w-full text-primary-text" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setDropdownOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => {
          setTimeout(() => {
            if (
              containerRef.current &&
              !containerRef.current.contains(document.activeElement)
            ) {
              setDropdownOpen(false);
            }
          }, 200);
        }}
        onKeyDown={(e) => {
          if (!dropdownOpen) return;

          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev < filtered.length - 1 ? prev + 1 : prev
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (filtered[highlightedIndex]) {
              handleSelect(filtered[highlightedIndex]);
            } else if (query.trim() !== "") {
              setSelectedOrganizer({ id: null, name: query });
            }

            // focus on the next thing
            if (wikiRef?.current) {
              wikiRef.current.focus();
            }
            setDropdownOpen(false);
          }
        }}
        placeholder="Search or add organizer..."
        className="w-full px-3 py-2 border rounded-md text-sm pr-6
        transition-all focus:outline-none focus:ring-3 focus:ring-ring/50"
      />

      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setSelectedOrganizer(null);
            setDropdownOpen(false);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}

      {dropdownOpen && (
        <div
          className="absolute z-10 mt-1 w-full bg-white border border-muted 
        rounded-md shadow-md max-h-64 overflow-auto"
        >
          {filtered.length > 0 ? (
            filtered.map((org, index) => (
              <div
                key={org.id}
                onClick={() => handleSelect(org)}
                className={`
                  px-3 py-2 text-sm cursor-pointer transition-all duration-75 rounded-lg
                  ${
                    index === highlightedIndex
                      ? "bg-primary-lightest text-primary-muted"
                      : "hover:bg-primary-lightest hover:text-primary-muted"
                  }
                `}
              >
                {org.name}
              </div>
            ))
          ) : (
            <div
              onClick={() => {
                setSelectedOrganizer({ id: null, name: query });
                setDropdownOpen(false);
              }}
              className="flex gap-1 items-center px-3 py-2 text-sm cursor-pointer text-primary-muted hover:bg-muted"
            >
              <FaPlus className="w-3 h-3" /> Create new organizer
            </div>
          )}
        </div>
      )}
    </div>
  );
}
