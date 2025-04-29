export type ApplicationType =
  | "unknown"
  | "closed"
  | "no_aa"
  | "open"
  | "expected";

export const applicationTypeLabels: Record<ApplicationType, string> = {
  unknown: "Unknown",
  closed: "Closed",
  no_aa: "No Artist Alley",
  open: "Open",
  expected: "Expected",
};

export const isValidApplicationType = (
  status: string | null
): status is ApplicationType => {
  return ["open", "closed", "no_aa", "expected", "unknown"].includes(
    status ?? "unknown"
  );
};
