export type ApplicationType =
  | "unknown"
  | "closed"
  | "no_aa"
  | "open"
  | "expected"
  | "predicted"
  | "announced";

export const applicationTypeLabels: Record<ApplicationType, string> = {
  unknown: "No Info Yet",
  closed: "Closed",
  no_aa: "No Artist Alley",
  open: "Open!",
  expected: "Expected",
  predicted: "Around this Time",
  announced: "Announced",
};

export const isValidApplicationType = (
  status: string | null
): status is ApplicationType => {
  return ["open", "closed", "no_aa", "expected", "unknown"].includes(
    status ?? "unknown"
  );
};
