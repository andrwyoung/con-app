import { UnifiedSuggestion } from "@/types/admin-panel-types";
import { pushArtistAlleyUpdate } from "../actions/push-aa-info-update";
import { ArtistAlleyInfoFields } from "@/types/suggestion-types";

export async function approveSuggestion(
  suggestion: UnifiedSuggestion,
  adminId: string
): Promise<boolean> {
  // Figure out what table to update
  switch (suggestion.type) {
    case "artist_alley": {
      const raw = suggestion.raw as ArtistAlleyInfoFields;
      const fieldsToUpdate: Record<string, unknown> = {};

      // Add only what's been marked as changed
      if (
        suggestion.changedFields?.includes("aaStatus") ||
        suggestion.changedFields?.includes("aaExistence")
      ) {
        fieldsToUpdate.aa_status_override = raw.aa_status_override;
      }
      if (suggestion.changedFields?.includes("startDate")) {
        fieldsToUpdate.aa_open_date = raw.aa_open_date;
      }
      if (suggestion.changedFields?.includes("deadline")) {
        fieldsToUpdate.aa_deadline = raw.aa_deadline;
      }
      if (suggestion.changedFields?.includes("website")) {
        fieldsToUpdate.aa_link = raw.aa_link;
      }

      try {
        await pushArtistAlleyUpdate(
          adminId,
          suggestion.id,
          suggestion.yearId,
          fieldsToUpdate
        );
      } catch (err) {
        console.log("Artist Alley Error: ", err);
        return false;
      }
    }
    // case "new_year": {
    //   const { raw } = suggestion;
    //   updateTarget = await supabaseAnon.from("convention_years").insert({
    //     convention_id: raw.convention_id,
    //     year: raw.year,
    //     venue: raw.venue,
    //     location: raw.location,
    //     start_date: raw.start_date,
    //     end_date: raw.end_date,
    //     event_status: raw.event_status,
    //   });
    //   break;
    // }
    // case "edit_con": {
    //   const { raw } = suggestion;
    //   updateTarget = await supabaseAnon
    //     .from("conventions")
    //     .update({
    //       name: raw.convention_name,
    //       website: raw.website,
    //       location_lat: raw.location_lat,
    //       location_long: raw.location_long,
    //       cs_description: raw.cs_description,
    //       discontinued: raw.discontinued,
    //       con_size: raw.con_size,
    //       tags: raw.tags,
    //       organizer_id: raw.organizer_id,
    //     })
    //     .eq("id", raw.convention_id);
    //   break;
    // }
    // case "new_con": {
    //   const { raw } = suggestion;
    //   updateTarget = await supabaseAnon.from("conventions").insert({
    //     name: raw.convention_name,
    //     website: raw.website,
    //     location_lat: raw.location_lat,
    //     location_long: raw.location_long,
    //     cs_description: raw.cs_description,
    //     discontinued: raw.discontinued,
    //     con_size: raw.con_size,
    //     tags: raw.tags,
    //     organizer_id: raw.organizer_id,
    //   });
    //   break;
    // }
    default:
      console.error("Unsupported Suggestion Type");
      return false;
  }
}
