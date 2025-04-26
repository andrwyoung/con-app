import { ConventionInfo } from "@/types/types";
import { getDistance } from "../utils";
import { SortType } from "@/types/search-types";
import { ExtendedTimeCategories } from "@/types/time-types";

export function getStartDate(event: ConventionInfo): Date {
  return event.latest_start_date
    ? new Date(`${event.latest_start_date}T00:00:00`)
    : new Date(event.latest_year, 0, 1);
}

// for the special sort of status
export function groupByStatus(
  items: ConventionInfo[]
): Record<string, ConventionInfo[]> {
  const grouped = items.reduce((acc, item) => {
    const status: ExtendedTimeCategories =
    item.specificYear?.year && item.specificYear.year !== item.latest_year
      ? "historical"
      : !item.convention_year_id
      ? "prediction"
      : item.timeCategory ?? "unknown";

    if (!acc[status]) acc[status] = [];
    acc[status].push(item);
    return acc;
  }, {} as Record<string, ConventionInfo[]>);

  // sort each group by date
  Object.entries(grouped).forEach(([key, group]) => {
    const reverseSort = key === "historical" || key === "past" || key === "discontinued";
  
    group.sort((a, b) => {
      const diff = getStartDate(a).getTime() - getStartDate(b).getTime();
      return reverseSort ? -diff : diff;
    });
  });
  return grouped;
}

export function sortEvents(
  items: ConventionInfo[],
  sortType: SortType,
  userLocation?: { latitude: number; longitude: number },
  placeLocation?: { latitude: number; longitude: number }
): ConventionInfo[] {
  const sorted = [...items];
  switch (sortType) {
    case "alpha":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "chron":
      sorted.sort(
        (a, b) => getStartDate(a).getTime() - getStartDate(b).getTime()
      );
      break;
    case "rev-chron":
      sorted.sort(
        (a, b) => getStartDate(b).getTime() - getStartDate(a).getTime()
      );
      break;
    case "just-passed":
      return sorted
        .filter((event) => getStartDate(event) < new Date())
        .sort((a, b) => getStartDate(b).getTime() - getStartDate(a).getTime());
    case "upcoming":
      return sorted
        .filter((event) => getStartDate(event) >= new Date())
        .sort((a, b) => getStartDate(a).getTime() - getStartDate(b).getTime());
    case "distance-me":
      if (userLocation) {
        const dist = (a: ConventionInfo) =>
          getDistance(
            [a.location_lat, a.location_long],
            [userLocation.latitude, userLocation.longitude]
          );
        sorted.sort((a, b) => dist(a) - dist(b));
      }
      break;
    case "distance":
      if (placeLocation) {
        const dist = (a: ConventionInfo) =>
          getDistance(
            [a.location_lat, a.location_long],
            [placeLocation.latitude, placeLocation.longitude]
          );
        sorted.sort((a, b) => dist(a) - dist(b));
      }
      break;
    default:
      break;
  }
  return sorted;
}
