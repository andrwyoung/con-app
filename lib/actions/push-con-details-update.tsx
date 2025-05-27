import { Convention } from "@/types/con-types";
import {
  ConDetailsFields,
  SuggestionsMetadataFields,
} from "@/types/suggestion-types";
import { getOrCreateOrganizerId } from "../editing/create-organizer";
import { supabaseAnon } from "../supabase/client";
import { buildApprovalMetadata } from "../editing/approval-metadata";
import { toast } from "sonner";

export async function adminPushConDetailsUpdate({
  userId,
  conId,
  suggestionId,
  newInfo,
  organizerHasChanged,
}: {
  userId: string;
  conId: number | undefined;
  suggestionId: string | undefined;
  newInfo: ConDetailsFields;
  organizerHasChanged: boolean;
}) {
  if (!suggestionId) {
    throw new Error("suggestionid or conid missing");
  }
  // PART 2a: push new convention info up

  const conTablePayload: Partial<Convention> = {
    cs_description: newInfo.new_description,
    con_size: newInfo.con_size,
    organizer_id: newInfo.organizer_id,
    discontinued: newInfo.discontinued,

    tags: newInfo.new_tags,
    social_links: newInfo.new_social_links,
    website: newInfo.new_website,

    location_lat: newInfo.new_lat,
    location_long: newInfo.new_long,
  };

  // make a new organizer if it doesn't already exist and slap it in there
  conTablePayload.organizer_id = await getOrCreateOrganizerId({
    organizerName: newInfo.organizer_name,
    organizerId: newInfo.organizer_id ?? null,
    organizerHasChanged: organizerHasChanged,
  });

  // KEY SECTION: here we actually change the data in the database
  await supabaseAnon
    .from("conventions")
    .update(conTablePayload)
    .eq("id", conId);

  // Also mark the suggestion as approved
  const updatesMetadata: SuggestionsMetadataFields =
    buildApprovalMetadata(userId);

  await supabaseAnon
    .from("suggestions_con_details")
    .update(updatesMetadata)
    .eq("id", suggestionId);

  toast.success("Admin: change pushed through!");
}
