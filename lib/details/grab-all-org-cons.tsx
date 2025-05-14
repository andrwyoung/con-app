// I included a feature on the detail panel (right after tags)
// where you can click on the organizer name and then the all the other
// cons that have the same organizer

// this is the file that gets all those conventions

import { useEventStore } from "@/stores/all-events-store";
import { supabaseAnon } from "../supabase/client";

export async function grabAllOrganizerCons(organizerId: string) {
  const { data, error } = await supabaseAnon
    .from("conventions")
    .select("id")
    .eq("organizer_id", organizerId);

  if (error) {
    console.error("Failed to fetch organizer conventions:", error);
    return [];
  }

  const allEvents = useEventStore.getState().allEvents;

  const conventions = (data ?? [])
    .map((d) => allEvents[d.id])
    .filter((c) => c !== undefined); // skip if not in cache

  return conventions;
}
