export const artistAlleyStatusConfig = {
  open: {
    label: "Open!",
    color: "bg-green-100 text-green-800 border-green-400",
    dark: "bg-emerald-300 text-green-800 border-green-400",
  },
  expected: {
    label: "Expected",
    color: "bg-orange-200 text-yellow-800 border-orange-300",
    dark: "bg-orange-300 text-yellow-800 border-orange-300",
  },
  watch_link: {
    label: "Look Out",
    color: "bg-yellow-200 text-yellow-800 border-yellow-300",
    dark: "bg-blue-300 text-green-800 border-blue-400",
  },
  waitlist: {
    label: "Waitlist",
    color: "bg-yellow-200 text-yellow-800 border-yellow-300",
    dark: "bg-yellow-300 text-yellow-800 border-yellow-300",
  },
  announced: {
    label: "Announced",
    color: "bg-blue-100 text-green-800 border-blue-400",
    dark: "bg-blue-100 text-green-800 border-blue-400",
  },
  closed: {
    label: "Closed",
    color: "bg-stone-200/50 text-stone-600 border-stone-300/50",
    dark: "bg-stone-200/50 text-stone-600 border-stone-300/50",
  },
  passed: {
    label: "Passed",
    color: "bg-stone-200/50 text-stone-600 border-stone-300/50",
    dark: "bg-stone-200/50 text-stone-600 border-stone-300/50",
  },
  no_aa: {
    label: "No Artist Alley",
    color: "bg-stone-200/50 text-stone-600 border-stone-300/50",
    dark: "bg-stone-200/50 text-stone-600 border-stone-300/50",
  },
  invite_only: {
    label: "Invite Only",
    color: "bg-stone-200/50 text-stone-600 border-stone-300/50",
    dark: "bg-stone-200/50 text-stone-600 border-stone-300/50",
  },
  unknown: {
    label: "No Info Yet",
    color: "bg-stone-200/50 text-stone-600 border-stone-300/50",
    dark: "bg-stone-200/50 text-stone-600 border-stone-300/50",
  },
} as const;

export type ArtistAlleyStatus = keyof typeof artistAlleyStatusConfig;
export const artistAlleyStatusList = Object.keys(
  artistAlleyStatusConfig
) as ArtistAlleyStatus[];

export const getAAStatusColor = (status: ArtistAlleyStatus) =>
  artistAlleyStatusConfig[status]?.color;

export const getAAStatusDarkColor = (status: ArtistAlleyStatus) =>
  artistAlleyStatusConfig[status]?.dark;

export const artistAlleyStatusLabels: Record<ArtistAlleyStatus, string> =
  Object.fromEntries(
    Object.entries(artistAlleyStatusConfig).map(([key, val]) => [
      key,
      val.label,
    ])
  ) as Record<ArtistAlleyStatus, string>;

export const isValidArtistAlleyStatus = (
  status: string | null
): status is ArtistAlleyStatus => {
  return status != null && status in artistAlleyStatusConfig;
};
