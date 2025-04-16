import { Tables } from "@/types/supabase";
import { TimeCategory } from "@/lib/helpers/event-recency";

export type Convention = Tables<"conventions">;
export type ConventionYear = Tables<"convention_years">;


export type FullConventionDetails = Convention & {
  convention_years: ConventionYear[];
};

// TODO: Get rid of ./supabase.ts deprecates this
export type ConLocation = {
  latitude: number;
  longitude: number;
};

export type EventInfo = {
  // from conventions
  id: number;
  slug: string; // solely for url naming
  name: string;

  location: string;
  location_lat: number;
  location_long: number;
  event_status: string;

  // for filters
  tags: string[];

  // from convention_years
  start_date?: string;
  end_date?: string;
  year: number;

  // my generated info
  timeCategory?: TimeCategory;
}