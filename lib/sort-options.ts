import { SortType } from "./sort-cons";

export const SORT_OPTIONS: { label: string; value: SortType }[] = [
    { value: "raw", label: "Default"},
    { value: "chron", label: "Latest First" },
    { value: "rev-chron", label: "Oldest First" },
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