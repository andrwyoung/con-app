import { ArtistAlleyStatus } from "@/types/artist-alley-types";
import { addMonths, isAfter, isBefore, parseISO } from "date-fns";

export function getAAStatus(
  start_date?: string | null,
  aa_open_date?: string | null,
  aa_deadline?: string | null,
  aa_real_release?: boolean | null,
  aa_status_override?: string | null,
  aa_watch_link?: boolean | null,
  event_status?: string | null
): ArtistAlleyStatus {
  const now = new Date();
  const open = aa_open_date ? new Date(aa_open_date + "T00:00:00") : null;
  const deadline = aa_deadline ? parseISO(aa_deadline) : null;
  const start = start_date ? parseISO(start_date) : null;

  // OVERRIDES
  //

  // if it is marked as no_aa then yea. there's no aa
  if (aa_status_override === "no_aa") return "no_aa";
  // same with invite_only
  if (aa_status_override === "invite_only") return "invite_only";
  // if it's manually marked as closed, then yea, it's closed
  if (aa_status_override === "closed") return "closed";

  // EASY LOGIC
  //

  // if the convention is this week or earlier, then it's for sure closed
  if (start && now > start) return "passed";

  // if the con itself is cancelled then mark closed;
  if (event_status === "EventCancelled") return "closed";

  // if deadline is here, it is for sure open
  if (deadline && now <= deadline) return "open";

  // if a real release date is here it must be announced
  if (open && now < open && aa_real_release) return "announced";

  // if a real release and it passed that date, then then it is
  // for sure open (even without an end date)
  if (open && now >= open && aa_real_release) return "open";

  // if the deadline has passed then it is closed
  if (deadline && now > deadline) return "closed";

  // else there might be a link you can watch;
  if (aa_watch_link) return "soon";

  // "EXPECTED" LOGIC
  //

  // if the release date is not an official one, and
  // it's like kind of around that date, then it's expected
  const twoWeeksFromNow = addMonths(now, 0.5); // ~2 weeks
  if (
    open &&
    !aa_real_release &&
    (isAfter(now, open) || isBefore(open, twoWeeksFromNow)) &&
    (!start || isAfter(start, addMonths(now, 1)))
  ) {
    return "expected";
  }

  // if it's a set amount of time away: like 3 months. mark as expected
  if (
    !open &&
    !aa_real_release &&
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
