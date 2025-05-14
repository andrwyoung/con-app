// I added an admin button that let's admin completely delete a convention year.
// So this is the file that does that (and then logs those changes)

import { supabaseAnon } from "../supabase/client";
import { toast } from "sonner";
import { checkIsAdmin } from "./authen";
import { SuggestionsMetadataFields } from "@/types/suggestion-types";

export async function NukeYear(
  yearId: string,
  conID: number,
  submittedBy: string
) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return;

  const metadata: SuggestionsMetadataFields = {
    submitted_by: submittedBy,
    approval_status: "approved",
    approved_by: submittedBy,
    merged_at: new Date().toISOString(),
  };

  console.log("trying to delete id: ", yearId);

  try {
    // Step 1: Delete the year from convention_years
    const { error: deleteError } = await supabaseAnon
      .from("convention_years")
      .delete()
      .eq("id", yearId);

    if (deleteError) throw deleteError;

    // Step 2: Insert audit record
    const { error: insertError } = await supabaseAnon
      .from("suggestions_new_year")
      .insert({
        convention_id: conID,
        is_new_year: false,
        ...metadata,
        notes: "DELETE",
      });

    if (insertError) throw insertError;

    toast.success("Convention year deleted");
  } catch (err) {
    console.error("Failed to nuke year:", err);
    toast.error("Failed to delete year");
    throw err;
  }
}
