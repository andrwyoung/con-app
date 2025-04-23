import { useMemo } from "react";
import { ConventionInfo, ConLocation, ConventionYear } from "@/types/types";
import { groupByStatus, sortEvents } from "@/lib/helpers/sort-cons";
import {
  TIME_CATEGORY_LABELS,
  timeCategories,
  TimeCategory,
} from "@/lib/helpers/event-recency";
import { SortType } from "@/types/search-types";

export type FlatItem =
  | { type: "label"; label: string }
  | { type: "card"; con: ConventionInfo; conYear?: ConventionYear };

function flattenWithHeaders(
  grouped: Record<TimeCategory, ConventionInfo[]>
): FlatItem[] {
  return timeCategories.flatMap((category) => {
    const cons = grouped[category] ?? [];
    if (!cons.length) return [];
    return [
      {
        type: "label",
        label: TIME_CATEGORY_LABELS[category] ?? category,
      } as const,
      ...cons.map((con) => ({ type: "card", con } as const)),
    ];
  });
}

export function useSortedAndGrouped<T extends ConventionInfo = ConventionInfo>({
  items,
  sortOption,
  userLocation,
  currentLocation,
}: {
  items: T[];
  sortOption: SortType;
  userLocation?: ConLocation;
  currentLocation?: ConLocation;
}) {
  let flat = useMemo(() => {
    return sortEvents(items, sortOption, userLocation, currentLocation);
  }, [items, sortOption, userLocation, currentLocation]);

  const grouped = useMemo(() => {
    if (sortOption === "status") {
      return groupByStatus(flat);
    }

    // TODO if (sortOption === "weekend") return groupByWeekend(flat);
    return undefined;
  }, [flat, sortOption]);

  const flattened: FlatItem[] = useMemo(() => {
    if (grouped) return flattenWithHeaders(grouped);
    return flat.map((con) => ({
      type: "card",
      con,
      conYear: "year" in con ? (con as any).year : undefined,
    }));
  }, [grouped, flat]);

  return { flattened };
}
