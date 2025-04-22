import {
  parseISO,
  startOfWeek,
  differenceInCalendarWeeks,
  startOfYear,
  addWeeks,
  addDays,
  format,
} from "date-fns";
import {
  END_OF_WEEKEND_LABEL,
  START_OF_WEEK,
  START_OF_WEEKEND_LABEL,
  Weekday,
} from "../constants";

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
    const startOfWindow = startOfWeek(date, { weekStartsOn: START_OF_WEEK });

    const weekend = differenceInCalendarWeeks(
      startOfWindow,
      startOfYear(date),
      {
        weekStartsOn: START_OF_WEEK,
      }
    );

    const res = {
      year: date.getFullYear(),
      weekend,
    } as Weekend;

    return res;
  } catch (err) {
    console.warn("Could not calculate weekend:", err);
    return null;
  }
}
