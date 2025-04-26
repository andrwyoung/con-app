// all the ways you can sort things

export type SortType =
  | "alpha"
  | "chron"
  | "rev-chron"
  | "just-passed"
  | "upcoming"
  | "status"
  | "distance"
  | "distance-me"
  | "raw";


// sortOption are just all the human readable names of SortType
// and is a subtype of SortType
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

export function getSortOptionsFor(
  values: SortType[],
  options: SortOption[] = SortOptions
): SortOption[] {
  return options.filter((opt) => values.includes(opt.value));
}

export function getSortLabel(
  value: SortType,
  options: SortOption[] = SortOptions
): string {
  if (value === "distance") return "Default";
  const match = options.find((opt) => opt.value === value);
  return match?.label ?? "Default";
}