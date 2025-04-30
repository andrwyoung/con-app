// grab ALL events from supabase
// we run this only once in the beginning since the data is really not that big (<3000)
// and we need to grab all of it anyways for the map. so we'll just keep it in local store afterwards

import { supabaseAnon } from "@/lib/supabase/client";
import { ConventionInfo, Weekend } from "@/types/con-types";
import { getEventTimeCategory } from "../helpers/time/event-recency";
import { findWeekendBucket } from "../calendar/determine-weekend";

export default async function getAllEvents(): Promise<ConventionInfo[]> {
  try {
    const pageSize = 1000;
    const allData: ConventionInfo[] = [];
    let offset = 0;
    let done = false;
    
    // loop through database to get events
    while (!done) {
      const { data, error } = await supabaseAnon
        .from("latest_convention_years")
        .select("*")
        .range(offset, offset + pageSize - 1); // inclusive 

      if (error) throw error;

      if (!data || data.length === 0) {
        done = true;
      } else {
        allData.push(...data);
        offset += pageSize;
        if (data.length < pageSize) done = true;
      }
    }

    // this is where we add extra, generated fields like timeCategory or weekend
    // it's not neccesary but just helpful for filtering and stuff
    const normalizedData: ConventionInfo[] = (allData ?? []).map((event) => {
      return {
        ...event,
        timeCategory: getEventTimeCategory(event.event_status, event.latest_year, event.latest_start_date, event.latest_end_date),
        weekend: (() => {
          const bucket = findWeekendBucket(event.latest_start_date, event.latest_end_date);
          return bucket ? { year: bucket.year, weekend: bucket.weekend } as Weekend: null;
        })(),
      };
    });

    return normalizedData;
  } catch (err) {
    console.error("error fetching events for map:", err);
    return [];
  }
}
