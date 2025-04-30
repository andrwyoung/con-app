// since we're storing all convention data locally, we just "query" our hashmap with these functions

import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";
import { ConLocation, ConventionInfo } from "@/types/con-types";
import { getDistance } from "../utils";
import { IN_THE_AREA_RESULTS } from "../constants";

export const grabConventions = (text: string, events: Record<string, ConventionInfo>) => {
  const options: IFuseOptions<ConventionInfo> = {
    keys: [
      { name: "name", weight: 0.7 },
      { name: "venue", weight: 0.3 },
    ],
    threshold: 0.4,
    includeScore: false,
  };

  const fuse = new Fuse(Object.values(events), options);
  const results = fuse.search(text);

  return results.map(result => result.item);
};

// DEPRECATED: using fuse now
export const grabConventionsV1 = (text: string, events: Record<string, ConventionInfo>) => {
  return Object.values(events).filter((event) =>
    event.name.toLowerCase().includes(text.toLowerCase())
  );
};

export const grabNearbyConventions = (loc: ConLocation, events: Record<string, ConventionInfo>) => {
  const eventsList = Object.values(events);

  const radiusSteps = [0.5, 1, 2, 5, 10, 25];
  const result: typeof eventsList = [];

  for (const radius of radiusSteps) {
    const more = eventsList.filter((event) => {
      if (!event.location_lat || !event.location_long) return false;
      const dist = getDistance(
        [loc.longitude, loc.latitude],
        [event.location_long, event.location_lat]
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
