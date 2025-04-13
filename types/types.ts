// TODO: Get rid of ./supabase.ts deprecates this
export type ConLocation = {
  latitude: number;
  longitude: number;
};

export type EventInfo = {
  id: number;
  name: string;
  website: string;

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