import { ConventionInfo } from "@/types/con-types";
import {
  DAYS_SINCE_RECENT,
  DAYS_UNTIL_DISCONTINUED,
  DAYS_UNTIL_SOON,
  DAYS_UNTIL_UPCOMING,
} from "../../constants";
import { parseISO, startOfDay } from "date-fns";
import { TimeCategory } from "@/types/time-types";

export function daysUntil(upcomingDate: Date): number {
  return Math.ceil(
    (upcomingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function daysFrom(pastDate: Date): number {
  return Math.ceil(
    (new Date().getTime() - pastDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function getEventTimeCategory(
  eventStatus?: string | null,
  year?: number | null,
  startDate?: string | null,
  endDate?: string | null
): TimeCategory {
  // NOTE: supabase requires both event_status and year to not be null....but still checking lol
  if (!eventStatus || !year) return "unknown";

  if (eventStatus === "EventCancelled") return "cancelled";

  const now = startOfDay(new Date());

  const end = endDate
    ? startOfDay(parseISO(endDate))
    : year
    ? startOfDay(new Date(year, 11, 31)) // dec 31
    : null;

  const start = startDate
    ? startOfDay(parseISO(startDate))
    : year
    ? startOfDay(new Date(year, 0, 1)) // jan 1
    : null;

  if (!start || !end) return "unknown";

  // 1. check if it's happening now
  if (start <= now && end >= now) return "here";

  // 2. if it already ended, check how recently
  if (end < now) {
    const daysSinceEnded = daysFrom(end);
    if (daysSinceEnded <= DAYS_SINCE_RECENT) return "recent";
    if (daysSinceEnded > DAYS_UNTIL_DISCONTINUED) return "discontinued";
    return "past";
  }

  // 3. special case for postponed events. only care if it's not passed yet
  if (eventStatus === "EventPostponed") return "postponed";

  // 4. check how soon it is
  const daysTill = daysUntil(start);
  // if (daysTill <= DAYS_UNTIL_SOON && daysTill >= 0) return "here"; // a week out is considered "here"
  if (daysTill <= DAYS_UNTIL_UPCOMING && daysTill > DAYS_UNTIL_SOON)
    return "soon";

  return "upcoming";
}

export function getDaysUntilEvent(info: ConventionInfo): number | null {
  const start = info.latest_start_date
    ? parseISO(info.latest_start_date)
    : info.latest_year
    ? new Date(info.latest_year, 0, 1) // jan 1
    : null;

  if (!start) return null;

  return daysUntil(start);
}
