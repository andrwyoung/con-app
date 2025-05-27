import { supabaseAnon } from "@/lib/supabase/client";
import { buildRejectedMetadata } from "../editing/approval-metadata";
import { suggestionTableMap, SuggestionType } from "@/types/admin-panel-types";

export async function rejectSuggestion(
  type: SuggestionType,
  suggestionId: string,
  adminId: string
) {
  const metadata = buildRejectedMetadata(adminId);
  const table = suggestionTableMap[type];

  const { error } = await supabaseAnon
    .from(table)
    .update(metadata)
    .eq("id", suggestionId);

  if (error) throw error;
}
