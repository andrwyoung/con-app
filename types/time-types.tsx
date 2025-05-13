export const timeCategories = [
  "here",
  "upcoming",
  "past",
  "cancelled",
  "unknown",
] as const;

export const tagsFilterCategories = timeCategories.filter(
  (t): t is Exclude<TimeCategory, "unknown"> => t !== "unknown"
);

export const TIME_CATEGORY_LABELS: Record<TimeCategory, string> = {
  here: "This Week",
  upcoming: "Upcoming",
  past: "Passed",
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
