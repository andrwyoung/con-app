// note that all these types are for WRITING to the database
// even though it may share the same types as something in con-types
// or supabase types, it should be seperate

import { ArtistAlleyStatus } from "./artist-alley-types";

export type ApprovalStatus = "approved" | "pending" | "rejected";

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
  new_start_date: string | null | undefined;
  new_end_date: string | null | undefined;
  new_g_link: string | null | undefined;
  new_status: string | null | undefined;
  new_description: string | null | undefined;
  new_tags: string | null | undefined;
  new_website: string | null | undefined;
  new_social_links: string | null | undefined;
  notes: string | null | undefined;
  con_size: string | null | undefined;
  organizer: string | null | undefined;
};

export type NewYearInfoFields = {
  // technically a mandatory field, but we keep it loose here for admin
  start_date: string | undefined;
  end_date: string | null | undefined;
  g_link: string | null | undefined;
};
