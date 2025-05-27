import { Tables } from "@/types/supabase";
import { TimeCategory } from "./time-types";
import { ArtistAlleyStatus } from "./artist-alley-types";

export type Scope = "explore" | "plan" | "share" | "queue" | "unknown";
export type ConStatus =
  | "EventCancelled"
  | "EventScheduled"
  | "EventMovedOnline"
  | "EventPostponed";

export type ConLocation = {
  latitude: number;
  longitude: number;
};

export type Weekend = {
  year: number;
  weekend: number;
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

  con_size?: string;

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
};

// when grabbing details panel
export type Convention = Tables<"conventions">;
export type ConventionYear = Tables<"convention_years">;
export type Organizer = Tables<"organizers">;

export type FullConventionDetails = Convention & {
  convention_years: ConventionYear[];
  organizer: Organizer;
};

export type UserListItem = Tables<"user_convention_list_items">;
export type UserList = Tables<"user_convention_lists">;

// for editing con details
export type ConSize = "seed" | "small" | "medium" | "large" | "huge";

export const CON_SIZE_LABELS: Record<ConSize, string> = {
  seed: "Micro Con (under 1k)",
  small: "Small Con (1k - 10k)",
  medium: "Medium Con (10k - 25k)",
  large: "Large Con (25k - 100k)",
  huge: "Mega Con (100k +)",
};

export const CON_SIZE_LABELS_SHORT: Record<ConSize, string> = {
  seed: "Micro",
  small: "Small",
  medium: "Medium",
  large: "Large",
  huge: "Mega",
};

export const CON_STATUS_LABELS: Record<ConStatus, string> = {
  EventScheduled: "Normal",
  EventPostponed: "Postponed",
  EventMovedOnline: "Online",
  EventCancelled: "Cancelled",
}

export type OrganizerType = {
  id: string | null;
  name: string;
};
