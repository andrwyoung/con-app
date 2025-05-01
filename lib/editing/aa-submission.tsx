import { supabaseAnon } from "../supabase/client";
import { toast } from "sonner";
import { checkIsAdmin } from "./authen";

export async function NukeAAInfo(yearId: string, submittedBy: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return;

  try {
    // Step 1: Nuke fields in convention_years
    const { error: updateError } = await supabaseAnon
      .from("convention_years")
      .update({
        aa_open_date: null,
        aa_deadline: null,
        aa_real_release: null,
        aa_link: null,
        aa_watch_link: false,
        aa_status_override: null,
      })
      .eq("id", yearId);

    if (updateError) throw updateError;

    // Step 2: Insert audit trail into suggestions table
    const { error: insertError } = await supabaseAnon
      .from("suggestions_artist_alley")
      .insert({
        convention_year_id: yearId,
        submitted_by: submittedBy,
        approval_status: "approved",
        approved_by: submittedBy,
        merged_at: new Date().toISOString(),
      });

    if (insertError) throw insertError;

    toast.success("Artist Alley info nuked 💣");
  } catch (err) {
    console.error("Failed to nuke AA info:", err);
    toast.error("Failed to clear AA info");
    throw err;
  }
}
