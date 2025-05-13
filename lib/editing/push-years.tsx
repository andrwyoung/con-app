// lib/editing/push-approved-year.ts
import { supabaseAnon } from "@/lib/supabase/client";
import {
  CompleteYearInfo,
  SuggestionsMetadataFields,
} from "@/types/suggestion-types";
import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "sonner";
import { buildApprovalMetadata } from "./approval-metadata";

export async function pushApprovedNewYear(
  packet: {
    yearInfo: CompleteYearInfo;
    suggestionId: string;
  },
  userId: string
) {
  try {
    await supabaseAnon.from("convention_years").insert(packet.yearInfo);
  } catch (err) {
    const typedError = err as PostgrestError;

    if (
      typedError.code === "23505" ||
      (typedError.message && typedError.message.includes("unique_con_year"))
    ) {
      toast.error("That year already exists.");
      throw new Error("Existing Year");
    }

    throw err;
  }

  const updatesMetadata: SuggestionsMetadataFields =
    buildApprovalMetadata(userId);

  // Mark the suggestion as approved
  await supabaseAnon
    .from("suggestions_new_year")
    .update(updatesMetadata)
    .eq("id", packet.suggestionId);

  toast.success(`Admin: Year ${packet.yearInfo.year} pushed through!`);
}

export async function pushApprovedUpdatedYear(
  packet: {
    yearInfo: CompleteYearInfo;
    suggestionId: string;
  },
  userId: string
) {
  try {
    await supabaseAnon
      .from("convention_years")
      .update({
        event_status: packet.yearInfo.event_status,
        start_date: packet.yearInfo.start_date,
        end_date: packet.yearInfo.end_date,
        venue: packet.yearInfo.venue,
        location: packet.yearInfo.location,
      })
      .eq("convention_id", packet.yearInfo.convention_id)
      .eq("year", packet.yearInfo.year);
  } catch (err) {
    const typedError = err as PostgrestError;

    toast.error("Failed to update year");
    throw typedError;
  }

  const updatesMetadata: SuggestionsMetadataFields =
    buildApprovalMetadata(userId);

  await supabaseAnon
    .from("suggestions_new_year")
    .update(updatesMetadata)
    .eq("id", packet.suggestionId);

  toast.success(`Admin: Year ${packet.yearInfo.year} updated!`);
}
