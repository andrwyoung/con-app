import { Tables } from "@/types/supabase";
import { TimeCategory } from "./time-types";
import { ArtistAlleyStatus } from "./artist-alley-types";

export type Scope = "explore" | "plan" | "share" | "unknown";

export type ConLocation = {
  latitude: number;
  longitude: number;
};

export type Weekend = {
  year: number,
  weekend: number,
}

export type ArtistAlleyInfoFields = {
  aa_open_date?: string;
  aa_deadline?: string;
  aa_real_release?: boolean;
  aa_link?: string;
  aa_watch_link: boolean;
  aa_status_override: ArtistAlleyStatus,
};

export type ConventionInfo = {
  // from conventions
  id: number;
  slug: string; // solely for url naming
  name: string;

  location: string;
  location_lat: number;
  location_long: number;
  tags: string[];

  // from convention_years
  convention_year_id?: string;
  latest_start_date?: string;
  latest_end_date?: string;
  latest_year: number;
  event_status: string;

  aa_open_date?: string;
  aa_deadline?: string;
  aa_real_release?: boolean;
  aa_link?: string;
  aa_status_override?: string;
  aa_watch_link?: boolean;

  // my generated info
  timeCategory?: TimeCategory;
  weekend?: Weekend | null;
  specificYear?: ConventionYear | null;
  aaStatus?: ArtistAlleyStatus;
}

// when grabbing details panel
export type Convention = Tables<"conventions">;
export type ConventionYear = Tables<"convention_years">;

export type FullConventionDetails = Convention & {
  convention_years: ConventionYear[];
};

export type UserListItem = Tables<"user_convention_list_items">;
export type UserList = Tables<"user_convention_lists">;