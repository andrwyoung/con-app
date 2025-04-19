// grab ALL events from supabase
// we run this only once in the beginning since the data is really not that big (~2000)
// and we need to grab all of it anyways for the map. so we'll just keep it in local store afterwards

import { supabaseAnon } from "@/lib/supabase/client";
import { ConventionInfo } from "@/types/types";
import { getEventTimeCategory } from "../helpers/event-recency";

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

    const normalizedData = (allData ?? []).map((event) => {
      return {
        ...event,
        timeCategory: getEventTimeCategory(event),
      };
    });

    return normalizedData;
  } catch (err) {
    console.error("error fetching events for map:", err);
    return [];
  }
}
