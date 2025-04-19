// the expandable scrollable list that shows cards
// responsible for any keybaord navigation interactions too

import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { ConLocation, ConventionInfo } from "@/types/types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Card, { CardVariant } from "../card";
import { useMapStore } from "@/stores/map-store";
import { useUIStore } from "@/stores/ui-store";
import { MAX_CARDS } from "@/lib/constants";
import { groupByStatus, sortEvents, SortType } from "@/lib/helpers/sort-cons";
import {
  TIME_CATEGORY_LABELS,
  timeCategories,
  TimeCategory,
} from "@/lib/helpers/event-recency";
import { FlatCardList, GroupedCardList } from "./grouped-card-list";
import { useSortedAndGrouped } from "@/hooks/useSortedAndGroup";

export default function CardList({
  items,
  sortOption = "raw",
  currentLocation = null,
  type = "default",
}: {
  items: ConventionInfo[];
  sortOption?: SortType;
  currentLocation?: ConLocation | null;
  type?: CardVariant;
}) {
  const { setSelectedCon, selectedCon } = useSidebarStore();
  const flyTo = useMapStore((s) => s.flyTo);

  const selectedIndex = useSidebarStore((s) => s.selectedIndex);
  const setSelectedIndex = useSidebarStore((s) => s.setSelectedIndex);
  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const anyModalOpen = useUIStore((s) => s.anyModalOpen());

  const { userLocation } = useMapStore();

  // build out the sorted results
  const { flattened: sortedResults, grouped } = useSortedAndGrouped({
    items,
    sortOption,
    userLocation: userLocation ?? undefined,
    currentLocation: currentLocation ?? undefined,
  });

  // initialize refs for all cards for scrolling into view
  useEffect(() => {
    cardRefs.current = Array.from(
      { length: sortedResults.length },
      (_, i) => cardRefs.current[i] || React.createRef()
    );
  }, [sortedResults]);

  // keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      console.log("is any modal open:", anyModalOpen);
      if (anyModalOpen) return;

      if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return;
      e.preventDefault(); // prevent page scroll

      const current = selectedIndex ?? -1;

      const navigate = (next: number) => {
        setSelectedCon(sortedResults[next]);
        setSelectedIndex(next);
        setTimeout(() => {
          cardRefs.current[next]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 0);
      };

      // DISABLED: for now
      if (e.key === "ArrowDown") {
        const next = Math.min(
          current + 1,
          Math.min(sortedResults.length, MAX_CARDS) - 1
        );
        navigate(next);
      }

      if (e.key === "ArrowUp") {
        const next = Math.max(current - 1, 0);
        navigate(next);
      }

      if (e.key === "Enter") {
        const con = sortedResults[current];
        if (con?.location_lat && con?.location_long) {
          flyTo?.(
            { latitude: con.location_lat, longitude: con.location_long },
            9
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    items,
    sortedResults,
    selectedCon,
    selectedIndex,
    setSelectedCon,
    flyTo,
    anyModalOpen,
  ]);

  // reset index when list changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [items, sortOption]);

  return (
    <div className="flex flex-col">
      {grouped ? (
        <GroupedCardList
          grouped={grouped}
          selectedCon={selectedCon}
          setSelectedCon={setSelectedCon}
          setSelectedIndex={setSelectedIndex}
          cardRefs={cardRefs.current}
          type={type}
        />
      ) : (
        <FlatCardList
          items={sortedResults}
          selectedCon={selectedCon}
          setSelectedCon={setSelectedCon}
          setSelectedIndex={setSelectedIndex}
          cardRefs={cardRefs.current}
          type={type}
        />
      )}
      {items.length > MAX_CARDS && (
        <p className="text-sm text-primary-muted self-center mt-2">
          Only showing {MAX_CARDS} results
        </p>
      )}
    </div>
  );
}
