// the expandable scrollable list that shows cards
// responsible for any keybaord navigation interactions too

import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { ConLocation, EventInfo } from "@/types/types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Card, { CardVariant } from "./card";
import { useMapStore } from "@/stores/map-store";
import { useUIStore } from "@/stores/ui-store";
import { MAX_CARDS } from "@/lib/constants";
import { groupByStatus, sortEvents, SortType } from "@/lib/helpers/sort-cons";
import {
  TIME_CATEGORY_LABELS,
  timeCategories,
  TimeCategory,
} from "@/lib/helpers/event-recency";

export default function NavigatableCardList({
  items,
  sortOption = "raw",
  currentLocation = null,
  type = "default",
}: {
  items: EventInfo[];
  sortOption?: SortType;
  currentLocation?: ConLocation | null;
  type?: CardVariant;
}) {
  const { setSelectedCon, selectedCon } = useSidebarStore();
  const flyTo = useMapStore((s) => s.flyTo);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const anyModalOpen = useUIStore((s) => s.anyModalOpen());

  const { userLocation } = useMapStore();

  // initialize refs for all cards for scrolling into view
  useEffect(() => {
    cardRefs.current = items.map(
      (_, i) => cardRefs.current[i] || React.createRef()
    );
  }, [items]);

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

      const current =
        selectedIndex ?? items.findIndex((c) => c.id === selectedCon?.id) ?? -1;

      const navigate = (next: number) => {
        setSelectedCon(items[next]);
        setSelectedIndex(next);
        setTimeout(() => {
          cardRefs.current[next]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 0);
      };

      if (e.key === "ArrowDown") {
        const next = Math.min(
          current + 1,
          Math.min(items.length, MAX_CARDS) - 1
        );
        navigate(next);
      }

      if (e.key === "ArrowUp") {
        const next = Math.max(current - 1, 0);
        navigate(next);
      }

      if (e.key === "Enter") {
        const con = items[current];
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
  }, [items, selectedCon, selectedIndex, setSelectedCon, flyTo, anyModalOpen]);

  // build out the sorted results
  const sortedResults = useMemo(
    () =>
      sortEvents(
        items,
        sortOption,
        userLocation ?? undefined,
        currentLocation ?? undefined
      ),
    [items, sortOption, userLocation, currentLocation]
  );

  const groupStatusResults = useMemo(() => {
    if (sortOption !== "status") return null;
    return groupByStatus(sortedResults);
  }, [sortOption, sortedResults]);

  return (
    <div className="flex flex-col">
      {sortOption === "status" && groupStatusResults ? (
        // special case if we're sorting by status
        <div className="flex flex-col gap-3">
          {Object.entries(groupStatusResults)
            .sort(([a], [b]) => {
              return (
                timeCategories.indexOf(a as TimeCategory) -
                timeCategories.indexOf(b as TimeCategory)
              );
            })
            .map(([status, group]) => (
              <div key={status}>
                <h3 className="text-xs font-semibold text-primary-muted mb-2 px uppercase tracking-wide">
                  {TIME_CATEGORY_LABELS[status as TimeCategory]}
                </h3>
                <div className="flex flex-col gap-3 pr-1 m-1">
                  {group.slice(0, MAX_CARDS).map((con, i) => (
                    <Card
                      key={con.id || i}
                      info={con}
                      selected={selectedCon?.id === con.id}
                      onClick={() => {
                        setSelectedCon(selectedCon?.id === con.id ? null : con);
                        setSelectedIndex(i);
                      }}
                      ref={cardRefs.current[i]}
                      type={type}
                    />
                  ))}
                </div>
              </div>
            ))}{" "}
        </div>
      ) : (
        // the normal sort case
        <div className="flex flex-col gap-3 pr-1 m-1">
          {" "}
          {sortedResults.slice(0, MAX_CARDS).map((con, i) => (
            <Card
              key={con.id || i}
              info={con}
              selected={selectedCon?.id === con.id}
              onClick={() => {
                setSelectedCon(selectedCon?.id === con.id ? null : con);
                setSelectedIndex(i);
              }}
              ref={cardRefs.current[i]}
              type={type}
            />
          ))}
        </div>
      )}
      {items.length > MAX_CARDS && (
        <p className="text-sm text-primary-muted self-center mt-2">
          Only showing {MAX_CARDS} results
        </p>
      )}
    </div>
  );
}
