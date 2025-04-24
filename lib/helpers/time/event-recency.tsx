import { ConventionInfo } from "@/types/types";
import {
  DAYS_SINCE_RECENT,
  DAYS_UNTIL_DISCONTINUED,
  DAYS_UNTIL_SOON,
  DAYS_UNTIL_UPCOMING,
} from "../../constants";
import { parseISO } from "date-fns";

export const timeCategories = [
  "here",
  "postponed",
  "soon",
  "upcoming",
  "recent",
  "past",
  "discontinued",
  "cancelled",
  "unknown",
] as const;

export const TIME_CATEGORY_LABELS: Record<TimeCategory, string> = {
  here: "Now",
  postponed: "Postponed",
  soon: "Soon",
  upcoming: "Upcoming",
  recent: "Just Ended",
  past: "Earlier",
  discontinued: "Discontinued",
  cancelled: "Cancelled",
  unknown: "Unknown",
};

export type TimeCategory = (typeof timeCategories)[number];

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

  const now = new Date();

  const end = endDate
    ? parseISO(endDate)
    : year
    ? new Date(year, 11, 31) // dec 31
    : null;

  const start = startDate
    ? parseISO(startDate)
    : year
    ? new Date(year, 0, 1) // jan 1
    : null;

  if (!start || !end) return "unknown";

  if (end < now) {
    const daysSinceEnded = daysFrom(end);
    if (daysSinceEnded <= DAYS_SINCE_RECENT) return "recent";
    if (daysSinceEnded > DAYS_UNTIL_DISCONTINUED) return "discontinued";
    return "past";
  }

  if (eventStatus === "EventPostponed") return "postponed";

  const daysTill = daysUntil(start);
  if (daysTill <= DAYS_UNTIL_SOON && daysTill >= 0) return "here";
  if (daysTill <= DAYS_UNTIL_UPCOMING && daysTill > DAYS_UNTIL_SOON)
    return "soon";

  return "upcoming";
}

export function getDaysUntilEvent(info: ConventionInfo): number | null {
  const start = info.start_date
    ? parseISO(info.start_date)
    : info.year
    ? new Date(info.year, 0, 1) // jan 1
    : null;

  if (!start) return null;

  return daysUntil(start);
}
