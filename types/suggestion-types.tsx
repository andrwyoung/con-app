// note that all these types are for WRITING to the database
// even though it may share the same types as something in con-types
// or supabase types, it should be seperate

import { ArtistAlleyStatus } from "./artist-alley-types";
import { ConStatus } from "./con-types";
import { Tables } from "./supabase";

export type ApprovalStatus = "approved" | "pending" | "rejected" | "merged";
export type ArtistAlleySuggestion = Tables<"aa_admin_items">;

export type SuggestionsMetadataFields = {
  submitted_by: string | null | undefined;
  approval_status: ApprovalStatus | null | undefined;
  approved_by: string | null | undefined;
  merged_at: string | null | undefined;
};

export type ArtistAlleyInfoFields = {
  aa_open_date: string | null | undefined;
  aa_deadline: string | null | undefined;
  aa_real_release: boolean | null | undefined;
  aa_link: string | null | undefined;
  aa_status_override: ArtistAlleyStatus | null | undefined;
};

export type ConDetailsFields = {
  // section 1
  con_size: string | null | undefined;
  organizer_id: string | null | undefined;
  organizer_name: string | null | undefined;
  new_description: string | null | undefined;

  // section 2
  new_tags: string[] | null | undefined;
  new_social_links: string | null | undefined;
  new_website: string | null | undefined;

  // section 3
  new_lat: number | undefined;
  new_long: number | undefined;

  notes: string | null | undefined;
};

export type NewYearInfoFields = {
  event_status: ConStatus;

  year: number;
  start_date: string | null | undefined;
  end_date: string | null | undefined;

  venue: string | null | undefined;
  location: string | null | undefined;

  is_new_year: boolean;
  convention_year_id?: string;
};

export type CompleteYearInfo = Omit<NewYearInfoFields, "is_new_year"> & {
  convention_id: number;
  start_date: string;
};
