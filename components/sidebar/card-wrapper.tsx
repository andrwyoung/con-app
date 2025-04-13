// the expandable scrollable list that shows cards
// responsible for any keybaord navigation interactions too

import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { EventInfo } from "@/types/types";
import React, { useEffect, useRef, useState } from "react";
import Card from "./card";
import { useMapStore } from "@/stores/map-store";
import { useUIStore } from "@/stores/ui-store";
import { MAX_CARDS } from "@/lib/constants";

export default function NavigatableCardList({ items }: { items: EventInfo[] }) {
  const { setSelectedCon, selectedCon } = useSidebarStore();
  const flyTo = useMapStore((s) => s.flyTo);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const anyModalOpen = useUIStore((s) => s.anyModalOpen());

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
        if (con?.latitude && con?.longitude) {
          flyTo?.({ latitude: con.latitude, longitude: con.longitude }, 9);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedCon, selectedIndex, setSelectedCon, flyTo, anyModalOpen]);

  return (
    <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
      <div className="flex flex-col gap-3 pr-1 m-1">
        {items.slice(0, MAX_CARDS).map((con, i) => (
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
