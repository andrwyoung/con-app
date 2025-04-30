// DEPRECATED: until I renable keyboard nav
// things got too complicated with multiples lists showing

import { ConventionInfo } from "@/types/con-types";
import { FlatItem } from "./use-sorted-cards";
import { useEffect } from "react";

export function useCardListKeyboardNav({
  flattened,
  selectedIndex,
  selectedCon,
  setSelectedCon,
  setSelectedIndex,
  cardRefs,
  flyTo,
  anyModalOpen,
}: {
  flattened: FlatItem[];
  selectedIndex: number;
  selectedCon: ConventionInfo | null;
  setSelectedCon: (con: ConventionInfo | null) => void;
  setSelectedIndex: (i: number) => void;
  cardRefs: React.RefObject<HTMLDivElement>[];
  flyTo?: (
    coords: { latitude: number; longitude: number },
    zoom: number
  ) => void;
  anyModalOpen: boolean;
}) {
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

      if (anyModalOpen || !["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
        return;
      }

      e.preventDefault(); // prevent page scroll

      const current =
        selectedIndex ??
        flattened.findIndex(
          (item) => item.type === "card" && item.con.id === selectedCon?.id
        );

      const findNextIndex = (from: number) => {
        for (let i = from; i < flattened.length; i++) {
          if (flattened[i].type === "card") return i;
        }
        return from;
      };

      const findPrevIndex = (from: number) => {
        for (let i = from; i >= 0; i--) {
          if (flattened[i].type === "card") return i;
        }
        return from;
      };

      const navigate = (next: number) => {
        const item = flattened[next];
        if (item?.type !== "card") return;

        setSelectedCon(item.con);
        setSelectedIndex(next);

        setTimeout(() => {
          cardRefs[next]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 0);
      };

      if (e.key === "ArrowDown") {
        navigate(findNextIndex(current + 1));
      }

      if (e.key === "ArrowUp") {
        navigate(findPrevIndex(current - 1));
      }

      if (e.key === "Enter") {
        const item = flattened[current];
        if (
          item?.type === "card" &&
          item.con?.location_lat &&
          item.con?.location_long
        ) {
          flyTo?.(
            {
              latitude: item.con.location_lat,
              longitude: item.con.location_long,
            },
            9
          );

          setTimeout(() => {
            cardRefs[current]?.current?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }, 0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    flattened,
    selectedIndex,
    selectedCon,
    setSelectedCon,
    setSelectedIndex,
    cardRefs,
    flyTo,
    anyModalOpen,
  ]);
}
