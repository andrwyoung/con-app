import { useMemo } from "react";
import { ConventionInfo, ConLocation, ConventionYear } from "@/types/types";
import { groupByStatus, sortEvents } from "@/lib/helpers/sort-cons";

import { SortType } from "@/types/search-types";
import {
  EXTENDED_TIME_CATEGORY_LABELS,
  ExtendedTimeCategories,
  extendedTimeCategories,
} from "@/types/time-types";

export type FlatItem =
  | { type: "label"; label: string }
  | { type: "card"; con: ConventionInfo };

function flattenWithHeaders(
  grouped: Record<ExtendedTimeCategories, ConventionInfo[]>
): FlatItem[] {
  return extendedTimeCategories.flatMap((category) => {
    const cons = grouped[category] ?? [];
    if (!cons.length) return [];
    return [
      {
        type: "label",
        label: EXTENDED_TIME_CATEGORY_LABELS[category] ?? category,
      } as const,
      ...cons.map((con) => ({ type: "card", con } as const)),
    ];
  });
}

export function useSortedAndGrouped({
  items,
  sortOption,
  userLocation,
  currentLocation,
}: {
  items: ConventionInfo[];
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
    }));
  }, [grouped, flat]);

  return { flattened };
}
