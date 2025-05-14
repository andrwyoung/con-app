// when you click on a convention, a detail panel pops on on the right
// showing all the convention information
// this is the file that grabs all that data from the database

import type { FullConventionDetails } from "@/types/con-types";
import { supabaseAnon } from "../supabase/client";

export async function grabAllDetails(
  id: number
): Promise<FullConventionDetails | null> {
  const { data, error } = await supabaseAnon
    .from("conventions")
    .select("*, organizer:organizer_id(*), convention_years(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching convention details:", error);
    return null;
  }

  return data as FullConventionDetails;
}
