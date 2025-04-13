import { EventInfo } from "@/types/types";
import { getDistance } from "./utils";

export type SortType =
  | "alpha"
  | "chron"
  | "rev-chron"
  | "just-passed"
  | "upcoming"
  | "distance"
  | "distance-me"
  | "raw";

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
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );
      break;
    case "rev-chron":
      sorted.sort(
        (a, b) =>
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
      break;
    case "just-passed":
      return sorted
        .filter((event) => new Date(event.start_date) < new Date())
        .sort(
          (a, b) =>
            new Date(b.start_date).getTime() -
            new Date(a.start_date).getTime()
        );
    case "upcoming":
      return sorted
        .filter((event) => new Date(event.start_date) >= new Date())
        .sort(
          (a, b) =>
            new Date(a.start_date).getTime() -
            new Date(b.start_date).getTime()
        );
    case "distance-me":
      if (userLocation) {
        const dist = (a: EventInfo) =>
          getDistance(
            [a.latitude, a.longitude],
            [userLocation.latitude, userLocation.longitude]
          );
        sorted.sort((a, b) => dist(a) - dist(b));
      }
      break;
      case "distance":
        if (placeLocation) {
          const dist = (a: EventInfo) =>
            getDistance(
              [a.latitude, a.longitude],
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