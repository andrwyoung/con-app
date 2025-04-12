import { supabaseAnon } from "@/lib/supabase/client";
import { EventInfo } from "@/types/types";

export default async function getAllEvents(): Promise<EventInfo[]> {
  console.log("Grabbing events data");
  try {
    // TODO: supabase max select 1000 rows. so paginate
    const { data, error } = await supabaseAnon
      .from("full_convention_table")
      .select("*");

    if (error) throw error;
    console.log("Gotten initial Data. Len:", data.length);
    return data ?? [];
  } catch (err) {
    console.error("error fetching events for map:", err);
    return [];
  }
}
