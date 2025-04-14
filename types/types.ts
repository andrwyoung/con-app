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

  address: string;
  location_lat: number;
  location_long: number;

  // from convention_years
  start_date?: string;
  end_date?: string;
  year: number;
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