export type ArtistAlleyStatus =
  | "unknown"
  | "closed"
  | "no_aa"
  | "open"
  | "expected"
  | "predicted"
  | "announced";

export const artistAlleyStatusLabels: Record<ArtistAlleyStatus, string> = {
  unknown: "No Info Yet",
  closed: "Closed",
  no_aa: "No Artist Alley",
  open: "Open!",
  expected: "Expected",
  predicted: "Around this Time",
  announced: "Announced",
};

export const isValidArtistAlleyStatus = (
  status: string | null
): status is ArtistAlleyStatus => {
  return ["open", "closed", "no_aa", "expected", "unknown"].includes(
    status ?? "unknown"
  );
};
