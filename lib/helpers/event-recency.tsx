import { EventInfo } from "@/types/types";
import { DAYS_UNTIL_SOON } from "../constants";

type TimeCategory = "past" | "soon" | "upcoming" | "unknown";

function daysUntil(upcomingDate: Date): number {
  return Math.ceil(
    (upcomingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function getEventTimeCategory(info: EventInfo): TimeCategory {
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

  if (end < now) return "past";

  const daysTill = daysUntil(start);
  if (daysTill <= DAYS_UNTIL_SOON && daysTill >= 0) return "soon";

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
