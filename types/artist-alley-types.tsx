export type ArtistAlleyStatus =
  | "unknown"
  | "closed"
  | "passed"
  | "no_aa"
  | "invite_only"
  | "watch_link"
  | "waitlist"
  | "open"
  | "expected"
  | "announced";

export const artistAlleyStatusLabels: Record<ArtistAlleyStatus, string> = {
  unknown: "No Info Yet",
  closed: "Closed",
  passed: "Passed",
  watch_link: "Look Out",
  waitlist: "Waitlist",
  no_aa: "No Artist Alley",
  invite_only: "Invite Only",
  open: "Open!",
  expected: "Expected",
  announced: "Announced",
};

export const getAAStatusColor = (status: ArtistAlleyStatus) => {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-800 border-green-400";
    case "expected":
      return "bg-orange-200 text-yellow-800 border-orange-300";
    case "watch_link":
    case "waitlist":
      return "bg-yellow-200 text-yellow-800 border-yellow-300";
    case "announced":
      return "bg-blue-100 text-green-800 border-blue-400";
    case "closed":
    case "passed":
    case "no_aa":
    case "invite_only":
    case "unknown":
    default:
      return "bg-stone-200/50 text-stone-600 border-stone-300/50";
  }
};

export const isValidArtistAlleyStatus = (
  status: string | null
): status is ArtistAlleyStatus => {
  return ["open", "closed", "no_aa", "expected", "unknown"].includes(
    status ?? "unknown"
  );
};
