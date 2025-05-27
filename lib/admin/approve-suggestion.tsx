import { UnifiedSuggestion } from "@/types/admin-panel-types";
import { pushArtistAlleyUpdate } from "../actions/push-aa-info-update";
import {
  ArtistAlleyInfoFields,
  NewConFields,
  NewYearInfoFields,
} from "@/types/suggestion-types";
import {
  pushExistingYearUpdate,
  pushNewYear,
} from "../actions/year-push-helpers";
import { buildCompleteYearPayload } from "../editing/build-new-year";
import { pushNewConvention } from "../actions/push-new-con";
import { MinimumDetailPanelProps } from "@/stores/admin-panel-store";

export async function approveSuggestion(
  suggestion: UnifiedSuggestion,
  adminId: string,
  setSelectedCon: (s: MinimumDetailPanelProps | null) => void
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

      return true;
    }
    case "new_year": {
      if (!suggestion.conId || !suggestion.year) {
        console.error("Missing critical information: convention ID or year");
        return false;
      }
      const raw = suggestion.raw as NewYearInfoFields;

      try {
        if (suggestion.isNewYear) {
          const yearFields: NewYearInfoFields = {
            year: suggestion.year,

            event_status: raw.event_status,
            start_date: raw.start_date,
            end_date: raw.end_date,
            venue: raw.venue,
            location: raw.location,
            is_new_year: false,
          };

          const packet = {
            yearInfo: buildCompleteYearPayload(yearFields, suggestion.conId),
            suggestionId: suggestion.id,
          };

          await pushNewYear(packet, adminId);
        } else {
          const yearFields: NewYearInfoFields = {
            year: suggestion.year,

            event_status: undefined,
            start_date: undefined,
            end_date: undefined,
            venue: undefined,
            location: undefined,
            is_new_year: false,
          };

          if (suggestion.changedFields?.includes("startDate")) {
            yearFields.start_date = raw.start_date;
          }
          if (suggestion.changedFields?.includes("endDate")) {
            yearFields.end_date = raw.end_date;
          }
          if (suggestion.changedFields?.includes("venue")) {
            yearFields.venue = raw.venue;
          }
          if (suggestion.changedFields?.includes("location")) {
            yearFields.location = raw.location;
          }
          if (suggestion.changedFields?.includes("eventStatus")) {
            yearFields.event_status = raw.event_status;
          }

          const packet = {
            yearInfo: buildCompleteYearPayload(yearFields, suggestion.conId),
            suggestionId: suggestion.id,
          };

          await pushExistingYearUpdate(packet, adminId);
        }
      } catch (err) {
        console.log("Artist Alley Error: ", err);
        return false;
      }

      return true;
    }
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
    // return true;
    // }
    case "new_con": {
      const raw = suggestion.raw as NewConFields;

      const payload: NewConFields = {
        convention_name: raw.convention_name,
        website: raw.website,
        cs_description: raw.cs_description,
        venue: raw.venue,
        location: raw.location,
        location_lat: raw.location_lat,
        location_long: raw.location_long,
        year: raw.year,
        start_date: raw.start_date,
        end_date: raw.end_date,
      };

      try {
        const newConId = await pushNewConvention(
          payload,
          suggestion.id,
          adminId
        );

        setSelectedCon({ conId: newConId, conName: raw.convention_name });
      } catch (err) {
        console.error("New Convention Error: ", err);
        return false;
      }

      return true;
    }
    default:
      console.error("Unsupported Suggestion Type");
      return false;
  }
}
