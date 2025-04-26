import { getSortOptionsFor } from "@/types/sort-types";
import { ConventionInfo } from "@/types/types";

export const MAX_SEARCH_BATCH_SIZE = 500;

// how we keep track of TimeCategory
export const DAYS_UNTIL_DISCONTINUED = 550
export const DAYS_SINCE_RECENT = 7;
export const DAYS_UNTIL_SOON = 7;
export const DAYS_UNTIL_UPCOMING = 30;
export const DAYS_UNTIL_PREDICTIONS = 60;

// sidebar consts
export const DROPDOWN_RESULTS = 5;
export const IN_THE_AREA_RESULTS = 25;
export const MAX_CARDS = 100;
export const SPECIAL_CON_ID = {
    NO_RESULTS: -1,
    UNKNOWN_CON: -999,
    FUTURE_CON: 9999
}

// search consts
export const DEFAULT_SORT = "status";

// map consts
export const ZOOM_USE_DEFAULT = -1;
export const DEFAULT_ZOOM = 7;
export const DEFAULT_ZOOM_FAR = 5;
export const DEFAULT_LOCATION: { longitude: number; latitude: number } = {
    latitude: 37.7749, longitude: -122.4194
};



export enum Weekday {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

// calendar consts...I actually don't use like the majority of these lol
export const YEARS_MINUS = 2;
export const YEARS_PLUS = 1;
export const START_OF_WEEK = Weekday.MONDAY;
export const WEEKEND_ANCHOR = Weekday.SATURDAY;
// these are just concerned with labeling
export const START_OF_WEEKEND_LABEL = Weekday.FRIDAY;
export const END_OF_WEEKEND_LABEL = Weekday.SUNDAY;


// list consts
export const SPECIAL_LIST_KEYS = ["planning", "interested"] as const;
export const DEFAULT_LIST = "planning";
export const DEFAULT_LISTS = {
    planning: { label: "My Plan", items: [] },
    interested: { label: "Interested", items: [] },
  };
export const LIST_SORT_OPTIONS = getSortOptionsFor(["raw", "status", "alpha"])
export const SEARCH_SORT_OPTIONS = getSortOptionsFor(["status", "distance-me", "alpha", "chron", "rev-chron"]);
export const CALENDAR_SORT_OPTIONS = getSortOptionsFor(["distance-me", "alpha"]); // unused yet



export const UNKNOWN_CONVENTION: ConventionInfo = {
    id: -1,
    slug: "non",
    name: "Unknown Convention",
  
    location: "unknown",
    location_lat: -15.6221,
    location_long: -130.9843,
    event_status: "unknown",
  
    tags: [],
  
    latest_year: 1999,
  
    timeCategory: "unknown",
  };