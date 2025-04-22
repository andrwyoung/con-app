import {
  addYears,
  addDays,
  isBefore,
  getDay,
  format,
  getYear,
  getMonth,
  startOfYear,
} from "date-fns";
import { START_OF_WEEK, YEARS_MINUS, YEARS_PLUS } from "../constants";
import { ConventionInfo } from "@/types/types";

export type WeekendBucket = {
  year: number;
  weekend: number;
  label: string;
  weekendStart: Date;
  weekendEnd: Date;
  cons?: ConventionInfo[];
};

export type MonthWithWeekends = {
  year: number;
  month: number;
  weekends: WeekendBucket[];
};

export function generateWeekendsByMonth(
  currentDate = new Date()
): MonthWithWeekends[] {
  const start = startOfYear(addYears(currentDate, -YEARS_MINUS));
  const end = startOfYear(addYears(currentDate, YEARS_PLUS + 1));

  const result: Record<string, MonthWithWeekends> = {};
  let current = start;

  // Find the first Tuesday
  while (getDay(current) !== START_OF_WEEK) {
    current = addDays(current, 1);
  }

  const weekendCounterByYear: Record<number, number> = {};

  while (isBefore(current, end)) {
    const tuesday = current;
    const saturday = addDays(tuesday, 4);
    const monday = addDays(tuesday, 6);

    const saturdayMonth = getMonth(saturday) + 1;
    const saturdayYear = getYear(saturday);
    const key = `${saturdayYear}-${saturdayMonth}`;

    const currentCount = weekendCounterByYear[saturdayYear] ?? 0;
    weekendCounterByYear[saturdayYear] = currentCount + 1;

    if (!result[key]) {
      result[key] = {
        year: saturdayYear,
        month: saturdayMonth,
        weekends: [],
      };
    }

    result[key].weekends.push({
      year: saturdayYear,
      weekend: currentCount,
      weekendStart: tuesday,
      weekendEnd: monday,
      label: `Weekend of ${format(saturday, "MMM d, yyyy")}`,
    });

    current = addDays(current, 7); // next Tuesday
  }

  return Object.values(result);
}
