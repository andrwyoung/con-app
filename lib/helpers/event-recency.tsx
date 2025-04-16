import { EventInfo } from "@/types/types";
import {
  DAYS_SINCE_RECENT,
  DAYS_UNTIL_SOON,
  DAYS_UNTIL_UPCOMING,
} from "../constants";

export const timeCategories = [
  "past",
  "recent",
  "here",
  "soon",
  "upcoming",
  "postponed",
  "discontinued",
  "cancelled",
  "unknown",
] as const;

export const TIME_CATEGORY_LABELS: Record<TimeCategory, string> = {
  past: "Earlier",
  recent: "Just Ended",
  here: "Now",
  soon: "Soon",
  upcoming: "Later",
  postponed: "Postponed",
  discontinued: "Ended Forever",
  cancelled: "Cancelled",
  unknown: "Unknown",
};

export type TimeCategory = (typeof timeCategories)[number];

export function daysUntil(upcomingDate: Date): number {
  return Math.ceil(
    (upcomingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function getEventTimeCategory(info: EventInfo): TimeCategory {
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
    const daysSinceEnded = Math.ceil(
      (now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceEnded <= DAYS_SINCE_RECENT) return "recent";
    return "past";
  }

  const daysTill = daysUntil(start);
  if (daysTill <= DAYS_UNTIL_SOON && daysTill >= 0) return "here";
  if (daysTill <= DAYS_UNTIL_UPCOMING && daysTill > DAYS_UNTIL_SOON)
    return "soon";

  return "upcoming";
}

export function getDaysUntilEvent(info: EventInfo): number | null {
  const start = info.start_date
    ? new Date(info.start_date)
    : info.year
    ? new Date(`${info.year}-01-01`)
    : null;

  if (!start) return null;

  return daysUntil(start);
}
