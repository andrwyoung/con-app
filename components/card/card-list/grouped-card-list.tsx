import { ConventionInfo } from "@/types/types";
import Card, { CardVariant } from "../card";
import { MAX_CARDS } from "@/lib/constants";
import {
  TIME_CATEGORY_LABELS,
  timeCategories,
  TimeCategory,
} from "@/lib/helpers/event-recency";

export function FlatCardList({
  items,
  selectedCon,
  setSelectedCon,
  setSelectedIndex,
  cardRefs,
  type,
}: {
  items: ConventionInfo[];
  selectedCon: ConventionInfo | null;
  setSelectedCon: (c: ConventionInfo | null) => void;
  setSelectedIndex: (i: number) => void;
  cardRefs: React.RefObject<HTMLDivElement>[];
  type: CardVariant;
}) {
  return (
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
          ref={cardRefs[i]}
          type={type}
        />
      ))}
    </div>
  );
}

export function GroupedCardList({
  grouped,
  selectedCon,
  setSelectedCon,
  setSelectedIndex,
  cardRefs,
  type,
}: {
  grouped: Record<TimeCategory, ConventionInfo[]>;
  selectedCon: ConventionInfo | null;
  setSelectedCon: (c: ConventionInfo | null) => void;
  setSelectedIndex: (i: number) => void;
  cardRefs: React.RefObject<HTMLDivElement>[];
  type: CardVariant;
}) {
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(grouped)
        .sort(
          ([a], [b]) =>
            timeCategories.indexOf(a as TimeCategory) -
            timeCategories.indexOf(b as TimeCategory)
        )
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
                  ref={cardRefs[i]}
                  type={type}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
