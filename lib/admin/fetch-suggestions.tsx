import { UnifiedSuggestion } from "@/types/admin-panel-types";
import { supabaseAnon } from "../supabase/client";
import {
  ArtistAlleyInfoFields,
  ConDetailsFields,
  NewConFields,
  NewYearInfoFields,
} from "@/types/suggestion-types";

export async function fetchSuggestions(): Promise<UnifiedSuggestion[]> {
  const all: UnifiedSuggestion[] = [];

  const { data: aaData, error: aaError } = await supabaseAnon
    .from("aa_admin_items")
    .select("*")
    .eq("approval_status", "pending");

  if (aaError) {
    console.error("Error fetching AA suggestions:", aaError);
    return [];
  }

  aaData?.forEach((sugg) => {
    all.push({
      id: sugg.id,
      type: "artist_alley",
      conId: sugg.convention_id,
      conName: sugg.convention_name,
      year: sugg.current_year_data?.year,
      yearId: sugg.convention_year_id,
      submittedBy: sugg.submitted_username,
      approvedBy: sugg.approved_username,
      createdAt: sugg.created_at,
      approvalStatus: sugg.approval_status,
      changedFields: sugg.changed_fields,
      currentYearData: sugg.current_year_data,
      isCurrentYear: sugg.is_latest_year,
      raw: sugg as ArtistAlleyInfoFields,
    });
  });

  const { data: newYearData, error: newYearError } = await supabaseAnon
    .from("new_year_admin_items")
    .select("*")
    .eq("approval_status", "pending");

  if (newYearError) {
    console.error("Error fetching new year suggestions:", newYearError);
    return [];
  }

  newYearData?.forEach((sugg) => {
    all.push({
      id: sugg.id,
      type: "new_year",
      conId: sugg.convention_id,
      conName: sugg.convention_name,
      year: sugg.year,
      yearId: sugg.convention_year_id,
      submittedBy: sugg.submitted_username,
      approvedBy: sugg.approved_username,
      createdAt: sugg.created_at,
      approvalStatus: sugg.approval_status,
      currentYearData: sugg.current_year_data,
      isCurrentYear: sugg.is_latest_year,
      changedFields: sugg.changed_fields,
      isNewYear: sugg.is_new_year,
      raw: sugg as NewYearInfoFields,
    });
  });

  const { data: editData, error: editConError } = await supabaseAnon
    .from("edit_con_admin_items")
    .select("*")
    .eq("approval_status", "pending");

  if (editConError) {
    console.error("Error fetching con details suggestions:", editConError);
    return [];
  }

  editData?.forEach((sugg) => {
    all.push({
      id: sugg.id,
      type: "edit_con",
      conId: sugg.convention_id,
      conName: sugg.convention_name,
      submittedBy: sugg.submitted_username,
      approvedBy: sugg.approved_username,
      createdAt: sugg.created_at,
      approvalStatus: sugg.approval_status,
      currentConData: sugg.current_convention_data,
      raw: sugg as ConDetailsFields,
    });
  });

  const { data: newConData, error: newConError } = await supabaseAnon
    .from("new_con_admin_items")
    .select("*")
    .eq("approval_status", "pending");

  if (newConError) {
    console.error("Error fetching new con suggestions:", newConError);
    return [];
  }

  newConData?.forEach((sugg) => {
    all.push({
      id: sugg.id,
      type: "new_con",
      conName: sugg.convention_name,
      submittedBy: sugg.submitted_username,
      approvedBy: sugg.approved_username,
      createdAt: sugg.created_at,
      approvalStatus: sugg.approval_status,
      raw: sugg as NewConFields,
    });
  });

  console.log("Fetched suggestions. All: ", all);
  return all;
}
