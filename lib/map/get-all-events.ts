// grab ALL events from supabase
// we run this only once in the beginning since the data is really not that big (~2000)
// and we need to grab all of it anyways for the map. so we'll just keep it in local store afterwards

import { supabaseAnon } from "@/lib/supabase/client";
import { EventInfo } from "@/types/types";

export default async function getAllEvents(): Promise<EventInfo[]> {
  console.log("Grabbing events data");
  try {
    // TODO: supabase max select 1000 rows. so paginate
    const { data, error } = await supabaseAnon
    .from("latest_convention_years")
    .select("*");

    if (error) throw error;
    console.log("Gotten initial Data. Len:", data.length);

    const normalizedData = (data ?? []).map((event) => ({
      ...event,
      tags: event.tags
        ?.split(",")
        .map((tag: string) => tag.trim().toLowerCase())
        .filter(Boolean),
    }));
    
    return normalizedData;
  } catch (err) {
    console.error("error fetching events for map:", err);
    return [];
  }
}
