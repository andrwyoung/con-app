import {
  NewConFields,
  SuggestionsMetadataFields,
} from "@/types/suggestion-types";
import { TablesInsert } from "@/types/supabase";
import { supabaseAnon } from "../supabase/client";
import { buildApprovalMetadata } from "../editing/approval-metadata";
import { toast } from "sonner";

function generateSlug(input: string): string {
  return input
    .replace(/&|#\d+;|[^\w\s]/g, " ") // Replace symbols (&, #039;, punctuation) with space
    .replace(/\s+/g, " ") // Collapse multiple spaces into one
    .trim() // Remove leading/trailing spaces
    .toLowerCase() // Lowercase all
    .replace(/\s/g, "-"); // Replace space with dash
}

export async function pushNewConvention(
  payload: NewConFields,
  suggestionId: string,
  userId: string
) {
  const slug = generateSlug(payload.convention_name);

  // First make a new convention
  const conventionInsert: TablesInsert<"conventions"> = {
    name: payload.convention_name,
    location_lat: payload.location_lat,
    location_long: payload.location_long,

    website: payload.website.trim() === "" ? undefined : payload.website,
    cs_description:
      payload.cs_description.trim() === "" ? undefined : payload.cs_description,

    slug,
  };

  const { data: conData, error: conInsertError } = await supabaseAnon
    .from("conventions")
    .insert({
      ...conventionInsert,
    })
    .select()
    .single();

  if (conInsertError) {
    throw conInsertError;
  }

  // Then make a new year associated with that convention
  const conventionYearInsert: TablesInsert<"convention_years"> = {
    convention_id: conData.id,
    start_date: payload.start_date,
    end_date: payload.end_date,
    year: payload.year,

    venue: payload.venue,
    location: payload.location,
  };

  const { error: conYearInsertError } = await supabaseAnon
    .from("convention_years")
    .insert({
      ...conventionYearInsert,
    })
    .select()
    .single();

  if (conYearInsertError) {
    throw conYearInsertError;
  }

  // Mark the suggestion as approved
  const updatesMetadata: SuggestionsMetadataFields =
    buildApprovalMetadata(userId);

  await supabaseAnon
    .from("submit_new_con")
    .update(updatesMetadata)
    .eq("id", suggestionId);

  toast.success(
    `Admin: New convention pushed! Refresh page to see the new con`
  );
}
