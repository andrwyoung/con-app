// DEPRECATED: using zustland to grab conventions
import { EventInfo } from "@/types/types";
import { supabaseAnon } from "../supabase/client";

export const searchConventions = async (
  query: string
): Promise<EventInfo[]> => {
  const { data, error } = await supabaseAnon
    .from("full_convention_table")
    .select("*")
    .ilike("name", `%${query}%`)
    .limit(10);

  if (error) {
    console.error("search error:", error);
    return [];
  }

  return data;
};
