import { ConventionInfo } from "@/types/types";
import Card, { CardVariant } from "../card";
import { MAX_CARDS } from "@/lib/constants";
import { FlatItem } from "@/hooks/use-sorted-cards";

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
  return (
    <div className="flex flex-col gap-3 pr-1 m-1">
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
            key={item.con.id}
            info={item.con}
            yearInfo={item.conYear}
            selected={selectedCon?.id === item.con.id}
            onClick={() => {
              const isSelected = selectedCon?.id === item.con.id;
              setSelectedCon(isSelected ? null : item.con);
              setSelectedIndex(isSelected ? -1 : i);
            }}
            ref={cardRefs[i]}
            type={type}
          />
        )
      )}
    </div>
  );
}
