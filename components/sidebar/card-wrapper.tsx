// the expandable scrollable list that shows cards
// responsible for sorting the cards depending on the props passed in
// responsible for any keybaord navigation interactions too
import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { EventInfo } from "@/types/types";
import React, { useEffect, useRef, useState } from "react";
import Card from "./card";
import { useMapStore } from "@/stores/map-store";
import { useUIStore } from "@/stores/ui-store";
import { MAX_CARDS } from "@/lib/constants";
import { sortType } from "./modes/mode-wrapper";
import { getDistance } from "@/lib/utils";

export default function NavigatableCardList({
  items,
  sortType = "chron",
}: {
  items: EventInfo[];
  sortType?: sortType;
}) {
  const { setSelectedCon, selectedCon } = useSidebarStore();
  const flyTo = useMapStore((s) => s.flyTo);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const anyModalOpen = useUIStore((s) => s.anyModalOpen());

  const { userLocation } = useMapStore();

  // sort the cards
  const sortedItems = React.useMemo(() => {
    const sorted = [...items];
    switch (sortType) {
      case "alpha":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "chron":
        sorted.sort(
          (a, b) =>
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );
        break;
      case "rev-chron":
        sorted.sort(
          (a, b) =>
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
        break;
      case "just-passed":
        sorted
          .filter((event) => new Date(event.start_date) < new Date())
          .sort(
            (a, b) =>
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime()
          );
        break;
      case "upcoming":
        sorted
          .filter((event) => new Date(event.start_date) >= new Date())
          .sort(
            (a, b) =>
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime()
          );
        break;
      case "distance":
        const origin = userLocation;
        if (origin) {
          const dist = (a: EventInfo) =>
            getDistance(
              [a.latitude, a.longitude],
              [origin.latitude, origin.longitude]
            );
          sorted.sort((a, b) => dist(a) - dist(b));
        }
        break;
      default:
        break;
    }
    return sorted;
  }, [items, sortType, userLocation]);

  // initialize refs for all cards for scrolling into view
  useEffect(() => {
    cardRefs.current = sortedItems.map(
      (_, i) => cardRefs.current[i] || React.createRef()
    );
  }, [sortedItems]);

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
        selectedIndex ??
        sortedItems.findIndex((c) => c.id === selectedCon?.id) ??
        -1;

      const navigate = (next: number) => {
        setSelectedCon(sortedItems[next]);
        setSelectedIndex(next);
        setTimeout(() => {
          cardRefs.current[next]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 0);
      };

      if (e.key === "ArrowDown") {
        const next = Math.min(current + 1, sortedItems.length - 1);
        navigate(next);
      }

      if (e.key === "ArrowUp") {
        const next = Math.max(current - 1, 0);
        navigate(next);
      }

      if (e.key === "Enter") {
        const con = sortedItems[current];
        if (con?.latitude && con?.longitude) {
          flyTo?.({ latitude: con.latitude, longitude: con.longitude }, 9);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    sortedItems,
    selectedCon,
    selectedIndex,
    setSelectedCon,
    flyTo,
    anyModalOpen,
  ]);

  return (
    <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
      <div className="flex flex-col gap-3 pr-1 m-1">
        {sortedItems.slice(0, MAX_CARDS).map((con, i) => (
          <Card
            key={con.id || i}
            info={con}
            selected={selectedCon?.id === con.id}
            onClick={() => {
              setSelectedCon(selectedCon?.id === con.id ? null : con);
              setSelectedIndex(i);
            }}
            ref={cardRefs.current[i]}
          />
        ))}
        {items.length > MAX_CARDS && (
          <p className="text-sm text-primary-muted self-center">
            showing first {MAX_CARDS} results
          </p>
        )}
      </div>
    </div>
  );
}
