import { Tables } from "@/types/supabase";
import { TimeCategory } from "@/lib/helpers/event-recency";
import { Weekend } from "@/lib/calendar/determine-weekend";

export type Scope = "explore" | "plan" | "share" | "unknown";


export type ConventionWithYear = ConventionInfo & {
  year: ConventionYear;
};

export type ConLocation = {
  latitude: number;
  longitude: number;
};

export type ConventionInfo = {
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
  weekend?: Weekend | null;
}


export function cleanConventionInfo(con: any): ConventionInfo {
  return {
    id: con.id,
    slug: con.slug,
    name: con.name,
    location: con.location,
    location_lat: con.location_lat,
    location_long: con.location_long,
    event_status: con.event_status,
    tags: con.tags,
    start_date: con.start_date,
    end_date: con.end_date,
    year: con.year,
    timeCategory: con.timeCategory,
    weekend: con.weekend,
  };
}

// when grabbing details panel
export type Convention = Tables<"conventions">;
export type ConventionYear = Tables<"convention_years">;

export type FullConventionDetails = Convention & {
  convention_years: ConventionYear[];
};