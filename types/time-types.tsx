export const timeCategories = [
  "here",
  "upcoming",
  "postponed",
  "soon",
  "recent",
  "past",
  "discontinued",
  "cancelled",
  "unknown",
] as const;

export const TIME_CATEGORY_LABELS: Record<TimeCategory, string> = {
  here: "Now",
  postponed: "Postponed",
  soon: "Starting Soon",
  upcoming: "Upcoming",
  recent: "Just Ended",
  past: "Happened Earlier",
  discontinued: "Discontinued",
  cancelled: "Cancelled",
  unknown: "Unknown",
};

export type TimeCategory = (typeof timeCategories)[number];

// different types for planning mode
export const extendedTimeCategories = [
  "prediction",
  ...timeCategories,
  "historical",
] as const;

export type ExtendedTimeCategories = TimeCategory | "historical" | "prediction";

export const EXTENDED_TIME_CATEGORY_LABELS: Record<
  ExtendedTimeCategories,
  string
> = {
  ...TIME_CATEGORY_LABELS,
  historical: "Historical",
  prediction: "Wish List",
};
