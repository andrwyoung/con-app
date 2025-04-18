import { ConventionInfo } from "@/types/types";
import {
  DAYS_SINCE_RECENT,
  DAYS_UNTIL_DISCONTINUED,
  DAYS_UNTIL_SOON,
  DAYS_UNTIL_UPCOMING,
} from "../constants";

export const timeCategories = [
  "here",
  "soon",
  "upcoming",
  "recent",
  "past",
  "postponed",
  "discontinued",
  "cancelled",
  "unknown",
] as const;

export const TIME_CATEGORY_LABELS: Record<TimeCategory, string> = {
  here: "Now",
  soon: "Soon",
  past: "Earlier",
  recent: "Just Ended",
  upcoming: "Upcoming",
  postponed: "Postponed",
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

export function getEventTimeCategory(info: ConventionInfo): TimeCategory {
  if (info.event_status === "EventCancelled") return "cancelled";
  if (info.event_status === "EventPostponed") return "postponed";

  const now = new Date();

  const end = info.end_date
    ? new Date(info.end_date)
    : info.year
    ? new Date(`${info.year}-12-31`)
    : null;

  const start = info.start_date
    ? new Date(info.start_date)
    : info.year
    ? new Date(`${info.year}-01-01`)
    : null;

  if (!start || !end) return "unknown";

  if (end < now) {
    const daysSinceEnded = daysFrom(end);
    if (daysSinceEnded <= DAYS_SINCE_RECENT) return "recent";
    if (daysSinceEnded > DAYS_UNTIL_DISCONTINUED) return "discontinued";
    return "past";
  }

  const daysTill = daysUntil(start);
  if (daysTill <= DAYS_UNTIL_SOON && daysTill >= 0) return "here";
  if (daysTill <= DAYS_UNTIL_UPCOMING && daysTill > DAYS_UNTIL_SOON)
    return "soon";

  return "upcoming";
}

export function getDaysUntilEvent(info: ConventionInfo): number | null {
  const start = info.start_date
    ? new Date(info.start_date)
    : info.year
    ? new Date(`${info.year}-01-01`)
    : null;

  if (!start) return null;

  return daysUntil(start);
}
