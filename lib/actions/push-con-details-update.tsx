import { Convention } from "@/types/con-types";
import {
  CompleteYearInfo,
  ConDetailsFields,
  SuggestionsMetadataFields,
} from "@/types/suggestion-types";
import { getOrCreateOrganizerId } from "../editing/create-organizer";
import { supabaseAnon } from "../supabase/client";
import { buildApprovalMetadata } from "../editing/approval-metadata";
import { pushExistingYearUpdate, pushNewYear } from "./year-push-helpers";
import { toast } from "sonner";

type Packet = {
  yearInfo: CompleteYearInfo;
  suggestionId: string;
  isNewYear: boolean;
};

export async function adminPushConDetailsUpdate({
  userId,
  conId,
  suggestionId,
  newInfo,
  yearPackets,
  organizerHasChanged,
}: {
  userId: string;
  conId: number;
  suggestionId: string;
  newInfo: ConDetailsFields;
  yearPackets: Packet[];
  organizerHasChanged: boolean;
}) {
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

  // PART 2b: push individual years up now
  for (const packet of yearPackets) {
    if (packet.isNewYear) {
      await pushNewYear(packet, userId);
    } else {
      await pushExistingYearUpdate(packet, userId);
    }
  }

  toast.success("Admin: change pushed through!");
}
