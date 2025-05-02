import { ConventionInfo } from "@/types/con-types";
import Card, { CardVariant } from "../card";
import { MAX_CARDS } from "@/lib/constants";
import { FlatItem } from "@/hooks/use-sorted-cards";
import { getConventionYearId } from "@/lib/lists/helper-functions";
import { useEffect, useRef } from "react";

export function FlatCardList({
  items,
  selectedCon,
  setSelectedCon,
  setSelectedIndex,
  cardRefs,
  type,
}: {
  items: FlatItem[];
  selectedCon: ConventionInfo | null;
  setSelectedCon: (c: ConventionInfo | null) => void;
  setSelectedIndex: (i: number) => void;
  cardRefs: React.RefObject<HTMLDivElement>[];
  type: CardVariant;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // for scrolling cards into view when selected
  useEffect(() => {
    if (selectedCon) {
      const selectedIndex = items.findIndex(
        (item) =>
          item.type !== "label" &&
          item.con.id === selectedCon.id &&
          item.con.convention_year_id === selectedCon.convention_year_id
      );

      const ref = cardRefs[selectedIndex];
      if (ref?.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedCon, items, cardRefs]);

  return (
    <div ref={containerRef} className="flex flex-col gap-3 pr-1 m-1">
      {items.slice(0, MAX_CARDS).map((item: FlatItem, i: number) =>
        item.type === "label" ? (
          <h3
            key={`label-${i}`}
            className="text-xs font-semibold text-primary-muted uppercase tracking-wide"
          >
            {item.label}
          </h3>
        ) : (
          <Card
            key={`${item.con.id}-${getConventionYearId(item.con) ?? "base"}`}
            info={item.con}
            selected={
              // a convention must match both id and convention_year_id to be the same
              selectedCon?.id === item.con.id &&
              selectedCon?.convention_year_id === item.con.convention_year_id
            }
            onClick={() => {
              const isSelected =
                selectedCon?.id === item.con.id &&
                selectedCon?.convention_year_id === item.con.convention_year_id;
              setSelectedCon(isSelected ? null : item.con);
              setSelectedIndex(isSelected ? -1 : i);
            }}
            ref={cardRefs[i]}
            type={
              // allow prediction to have it's natural color everywhere except in lists
              !item.con.convention_year_id && type != "list"
                ? "prediction"
                : type
            }
          />
        )
      )}
    </div>
  );
}
