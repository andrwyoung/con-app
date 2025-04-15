import { TimeCategory } from "@/lib/helpers/event-recency";

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

export type EventInfoV1 = {
  id: number;
  name: string;
  url: string;

  created_at: string;

  date: string;
  days_length: number;
  start_date: string;
  end_date: string;
  year: number;
  
  venue: string;
  latitude: number;
  longitude: number;
  location?: string;
}