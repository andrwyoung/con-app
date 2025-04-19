import { useMemo } from "react";
import { ConventionInfo, ConLocation } from "@/types/types";
import { groupByStatus, sortEvents, SortType } from "@/lib/helpers/sort-cons";
import { timeCategories } from "@/lib/helpers/event-recency";

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

  const flattened = useMemo(() => {
    if (!grouped) return flat;
    // always flatten based off of category order
    return timeCategories.flatMap((category) => grouped[category] ?? []);
  }, [grouped, flat]);

  return { flattened, grouped };
}
