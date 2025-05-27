import { supabaseAnon } from "@/lib/supabase/client";
import { ConventionYear } from "@/types/con-types";
import { SuggestionsMetadataFields } from "@/types/suggestion-types";
import { buildApprovalMetadata } from "@/lib/editing/approval-metadata";
import { toast } from "sonner";

export async function pushArtistAlleyUpdate(
  userId: string,
  suggestionId: string,
  yearId: string | undefined,
  updates: Partial<ConventionYear>
) {
  if (!yearId) throw new Error("YearId doesn't exist");

  // Update real convention_years table
  const { error: updateError } = await supabaseAnon
    .from("convention_years")
    .update(updates)
    .eq("id", yearId);

  if (updateError) throw updateError;

  // Mark the suggestion as approved
  const metadata: SuggestionsMetadataFields = buildApprovalMetadata(userId);

  const { error: metadataError } = await supabaseAnon
    .from("suggestions_artist_alley")
    .update(metadata)
    .eq("id", suggestionId);

  if (metadataError) throw metadataError;

  toast.success("Admin: change pushed through!");
}
