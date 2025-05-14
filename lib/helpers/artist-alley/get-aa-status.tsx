// there are so many possibilities for artist alley applications deadlines/release dates
// like some cons have deadlines while others don't...some have dedicated relase dates.
// So all this logic here is to try my best to capture the most edge cases

import { ArtistAlleyStatus } from "@/types/artist-alley-types";
import { addMonths, isAfter, isBefore, parseISO } from "date-fns";

export function getAAStatus(
  start_date?: string | null,
  aa_open_date?: string | null,
  aa_deadline?: string | null,
  aa_status_override?: string | null,
  event_status?: string | null
): ArtistAlleyStatus {
  const now = new Date();
  const open = aa_open_date ? parseISO(aa_open_date) : null;
  const deadline = aa_deadline ? parseISO(aa_deadline) : null;
  const start = start_date ? parseISO(start_date) : null;

  // OVERRIDES
  //

  // trust the override first
  // NOTE: we ignore "open" and "closed" because they should be derived states
  // NOTE: "watch_link" is not on here. we deal with that later
  if (aa_status_override === "no_aa") return "no_aa";
  if (aa_status_override === "invite_only") return "invite_only";
  if (aa_status_override === "waitlist") return "waitlist";

  // EASY LOGIC
  //

  // if the convention is this week or earlier, then it's for sure closed
  if (start && now > start) return "passed";

  // if the con itself is cancelled then mark closed;
  if (event_status === "EventCancelled") return "closed";

  // if deadline is here, it is for sure open
  if (deadline && now <= deadline) return "open";

  // if the deadline has passed then it is closed
  if (deadline && now > deadline) return "closed";

  // if a real release date exists but it's not yet here it must be announced
  if (open && now < open) return "announced";

  // if a real release and it passed that date, then then it is
  // for sure open (even without an end date)
  if (open && now >= open) return "open";

  // else there might be a link you can watch;
  if (aa_status_override === "watch_link") return "watch_link";

  // "EXPECTED" LOGIC
  //

  // if it's a set amount of time away: like 3 months. mark as expected
  if (
    !open &&
    start &&
    isAfter(start, addMonths(now, 3)) &&
    isBefore(start, addMonths(now, 5))
  ) {
    return "expected";
  }

  return "unknown";
}

export function applyRealAAStatusGuard(
  end_date: string | null,
  oldStatus?: ArtistAlleyStatus
): ArtistAlleyStatus {
  if (!end_date) return oldStatus ?? "unknown";
  if (!oldStatus) return "unknown";

  const isPast = parseISO(end_date) < new Date();

  if (isPast && oldStatus !== "no_aa") return "passed";

  return oldStatus;
}
