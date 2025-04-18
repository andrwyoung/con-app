import { EventInfo } from "@/types/types";

export const MAX_SEARCH_BATCH_SIZE = 500;

export const DAYS_UNTIL_DISCONTINUED = 550
export const DAYS_SINCE_RECENT = 7;
export const DAYS_UNTIL_SOON = 7;
export const DAYS_UNTIL_UPCOMING = 30;

// sidebar consts
export const DROPDOWN_RESULTS = 5;
export const IN_THE_AREA_RESULTS = 25;
export const MAX_CARDS = 100;
export const SPECIAL_CON_ID = {
    NO_RESULTS: -1,
    UNKNOWN_CON: -999,
}

// map consts
export const ZOOM_USE_DEFAULT = -1;
export const DEFAULT_ZOOM = 7;
export const DEFAULT_ZOOM_FAR = 5;
export const DEFAULT_LOCATION: { longitude: number; latitude: number } = {
    latitude: 37.7749, longitude: -122.4194
};


export const UNKNOWN_CONVENTION: EventInfo = {
    id: -1,
    slug: "non",
    name: "Unknown Convention",
  
    location: "unknown",
    location_lat: -15.6221,
    location_long: -130.9843,
    event_status: "unknown",
  
    tags: [],
  
    year: 1999,
  
    timeCategory: "unknown",
  };