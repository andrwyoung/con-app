// grab all information from supabase for the detail panel
// this is because we only store basic data on each con and need to fetch the rest

import type { FullConventionDetails } from "@/types/con-types";
import { supabaseAnon } from "../supabase/client";

export async function grabAllDetails(
  id: number
): Promise<FullConventionDetails | null> {
  const { data, error } = await supabaseAnon
    .from("conventions")
    .select("*, convention_years(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching convention details:", error);
    return null;
  }

  return data as FullConventionDetails;
}
