import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { EventInfo } from "@/types/types";
import React, { useEffect, useRef, useState } from "react";
import Card from "./card";
import { useMapStore } from "@/stores/map-store";

export default function NavigatableCardList({ items }: { items: EventInfo[] }) {
  const { setSelectedCon, selectedCon } = useSidebarStore();
  const flyTo = useMapStore((s) => s.flyTo);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  // initialize refs for all cards for scrolling into view
  useEffect(() => {
    cardRefs.current = items.map(
      (_, i) => cardRefs.current[i] || React.createRef()
    );
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        const next = Math.min(current + 1, items.length - 1);
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
  }, [items, selectedCon, selectedIndex, setSelectedCon, flyTo]);

  return (
    <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
      <div className="flex flex-col gap-3 pr-1 m-1">
        {items.map((con, i) => (
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
      </div>
    </div>
  );
}
