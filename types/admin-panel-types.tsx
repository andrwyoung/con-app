import {
  ApprovalStatus,
  ArtistAlleyInfoFields,
  ConDetailsFields,
  NewConFields,
  NewYearInfoFields,
} from "./suggestion-types";
import { Tables } from "./supabase";

export type SuggestionType =
  | "artist_alley"
  | "new_year"
  | "edit_con"
  | "new_con";

export const suggestionTypeLabels: Record<SuggestionType, string> = {
  artist_alley: "Artist Alley Update",
  new_year: "Single Year Update",
  edit_con: "Con Details Update",
  new_con: "New Con",
};

export const suggestionTableMap: Record<SuggestionType, string> = {
  artist_alley: "suggestions_artist_alley",
  new_year: "suggestions_new_year",
  edit_con: "suggestions_con_details",
  new_con: "submit_new_con",
};

export type UnifiedSuggestion = {
  id: string;
  type: SuggestionType;
  conId?: number;
  conName: string;
  year?: number;
  yearId?: string;
  submittedBy: string;
  approvedBy?: string;
  createdAt: string;
  approvalStatus: ApprovalStatus;
  changedFields?: string[];
  currentYearData?: Tables<"convention_years">;
  currentConData?: Tables<"conventions">;
  isCurrentYear?: boolean;
  isNewYear?: boolean;
  raw:
    | ArtistAlleyInfoFields
    | NewYearInfoFields
    | ConDetailsFields
    | NewConFields;
};
