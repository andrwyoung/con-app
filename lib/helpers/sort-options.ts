import { SortType } from "@/types/search-types";

export const SORT_OPTIONS: { label: string; value: SortType }[] = [
    { value: "status", label: "Status" },
    { value: "chron", label: "Earliest" },
    { value: "rev-chron", label: "Latest" },
    { value: "distance-me", label: "Distance (from me)" },
    { value: "alpha", label: "Alphabetical" },
];

export function getSortLabel(
    value: SortType,
    options = SORT_OPTIONS
  ): string {
    if (value === "distance" ) return "Default";
    const match = options.find((opt) => opt.value === value);
    return match?.label ?? "Default";
  }