import { ConventionWithYear, ConventionYear } from "@/types/types";
import { supabaseAnon } from "../supabase/client";
import { useEventStore } from "@/stores/all-events-store";

export async function grabConsFromSupabase(
  startDate: Date,
  endDate: Date
): Promise<ConventionYear[]> {
  const cleanStart = startDate.toISOString().split("T")[0];
  const cleanEnd = endDate.toISOString().split("T")[0];

  const { data, error } = await supabaseAnon
    .from("convention_years")
    .select("*")
    .not("start_date", "lt", cleanStart)
    .not("start_date", "gt", cleanEnd);

  if (error) {
    console.error("Error grabbing cons for weekend:", error);
    return [];
  }

  return data as ConventionYear[];
}

export function getConWithYear(
  conYears: ConventionYear[]
): ConventionWithYear[] {
  const allEvents = useEventStore.getState().allEvents;

  return conYears
    .map((cy) => {
      const info = allEvents[cy.convention_id];
      return info ? { ...info, year: cy } : null;
    })
    .filter((item): item is ConventionWithYear => !!item);
}
