import { parseISO, startOfYear, addWeeks, addDays, format } from "date-fns";
import {
  END_OF_WEEKEND_LABEL,
  START_OF_WEEK,
  START_OF_WEEKEND_LABEL,
  Weekday,
} from "../constants";
import { generateWeekendsByMonth } from "./generate-weekends";

export type Weekend = {
  year: number;
  weekend: number;
};

function daysUntil(targetDay: Weekday): number {
  return (targetDay - START_OF_WEEK + 7) % 7;
}

export function formatWeekendLabel(year: number, weekend: number): string {
  const weekendStart = addWeeks(startOfYear(new Date(year, 0, 1)), weekend);

  const adjustedStart = addDays(weekendStart, START_OF_WEEK);
  const friday = addDays(adjustedStart, daysUntil(START_OF_WEEKEND_LABEL));
  const sunday = addDays(adjustedStart, daysUntil(END_OF_WEEKEND_LABEL));

  return `${format(friday, "MMM d")}–${format(sunday, "MMM d")}`;
}

export function getWeekend(
  startDateStr?: string | null,
  endDateStr?: string | null
): Weekend | null {
  const rawDate = startDateStr ?? endDateStr;
  if (!rawDate) return null;

  try {
    const date = parseISO(rawDate);
    const allMonths = generateWeekendsByMonth(date); // up to 8 months from current
    const allWeekends = allMonths.flatMap((m) => m.weekends);

    const match = allWeekends.find(
      (bucket) => date >= bucket.weekendStart && date <= bucket.weekendEnd
    );

    return match ? { year: match.year, weekend: match.weekend } : null;
  } catch (err) {
    console.warn("Could not calculate weekend:", err);
    return null;
  }
}
