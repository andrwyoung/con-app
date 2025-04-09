import { EventInfo } from "@/types/types";
import { supabaseAnon } from "../supabase/client"
import { MAX_SEARCH_RESULTS } from "../constants";

export const searchConventions = async (query: string): Promise<EventInfo[]> => {
    const { data, error } = await supabaseAnon
        .from("full_convention_table")
        .select("*")
        .ilike("name", `%${query}%`)
        .limit(MAX_SEARCH_RESULTS);

    if (error) {
        console.error("search error:", error);
        return [];
    }

    return data;
}