// since we're storing all convention data locally, we just "query" our hashmap with these functions

import { ConLocation, EventInfo } from "@/types/types";
import { getDistance } from "../utils";
import { IN_THE_AREA_RESULTS } from "../constants";

export const grabConventions = (text: string, events: Record<string, EventInfo>) => {
  return Object.values(events).filter((event) =>
    event.name.toLowerCase().includes(text.toLowerCase())
  );
};

export const grabNearbyConventions = (loc: ConLocation, events: Record<string, EventInfo>) => {
  const eventsList = Object.values(events);

  const radiusSteps = [0.5, 1, 2, 5, 10, 25];
  const result: typeof eventsList = [];

  for (const radius of radiusSteps) {
    const more = eventsList.filter((event) => {
      if (!event.latitude || !event.longitude) return false;
      const dist = getDistance(
        [loc.longitude, loc.latitude],
        [event.longitude, event.latitude]
      );
      return dist <= radius;
    });

    // add unique results to list
    for (const ev of more) {
      if (!result.includes(ev)) {
        result.push(ev);
      }
    }

    if (result.length >= IN_THE_AREA_RESULTS) break; // got enough
  }

  return result.splice(0, IN_THE_AREA_RESULTS);
};
