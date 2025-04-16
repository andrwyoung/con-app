import { EventInfo } from "@/types/types";
import { getDistance } from "../utils";

export type SortType =
  | "alpha"
  | "chron"
  | "rev-chron"
  | "just-passed"
  | "upcoming"
  | "distance"
  | "distance-me"
  | "raw";

export function getStartDate(event: EventInfo): Date {
  return new Date(event.start_date ?? `${event.year}-01-01`);
}

export function sortEvents(
  items: EventInfo[],
  sortType: SortType,
  userLocation?: { latitude: number; longitude: number },
  placeLocation?: { latitude: number; longitude: number }
): EventInfo[] {
  const sorted = [...items];
  switch (sortType) {
    case "alpha":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "chron":
      sorted.sort(
        (a, b) =>
          getStartDate(a).getTime() - getStartDate(b).getTime()
      );
      break;
    case "rev-chron":
      sorted.sort(
        (a, b) =>
          getStartDate(b).getTime() - getStartDate(a).getTime()
      );
      break;
    case "just-passed":
      return sorted
        .filter((event) => getStartDate(event) < new Date())
        .sort(
          (a, b) =>
            getStartDate(b).getTime() - getStartDate(a).getTime()
        );
    case "upcoming":
      return sorted
        .filter((event) => getStartDate(event) >= new Date())
        .sort(
          (a, b) =>
            getStartDate(a).getTime() - getStartDate(b).getTime()
        );
    case "distance-me":
      if (userLocation) {
        const dist = (a: EventInfo) =>
          getDistance(
            [a.location_lat, a.location_long],
            [userLocation.latitude, userLocation.longitude]
          );
        sorted.sort((a, b) => dist(a) - dist(b));
      }
      break;
      case "distance":
        if (placeLocation) {
          const dist = (a: EventInfo) =>
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