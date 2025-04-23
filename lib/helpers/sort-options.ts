import { SortType } from "@/types/search-types";


export type SortOption = {
  label: string;
  value: SortType;
};

const SortOptions: SortOption[] = [
  { value: "status", label: "Status" },
  { value: "raw", label: "Manual" },
  { value: "chron", label: "Earliest" },
  { value: "rev-chron", label: "Latest" },
  { value: "distance-me", label: "Distance (from me)" },
  { value: "alpha", label: "Alphabetical" },
];

function getSortOptionsFor(
  values: SortType[],
  options: SortOption[] = SortOptions
): SortOption[] {
  return options.filter((opt) => values.includes(opt.value));
}

export const LIST_SORT_OPTIONS = getSortOptionsFor(["raw", "status", "alpha"])
export const SEARCH_SORT_OPTIONS = getSortOptionsFor(["status", "distance-me", "alpha", "chron", "rev-chron"]);
export const CALENDAR_SORT_OPTIONS = getSortOptionsFor(["distance-me", "alpha"]);

export function getSortLabel(
  value: SortType,
  options: SortOption[] = SortOptions
): string {
  if (value === "distance") return "Default";
  const match = options.find((opt) => opt.value === value);
  return match?.label ?? "Default";
}