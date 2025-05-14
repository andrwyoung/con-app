// this is where we define what a weekend means in our code

import {
  addYears,
  addDays,
  isBefore,
  getDay,
  format,
  getYear,
  getMonth,
  startOfYear,
  addMonths,
  startOfMonth,
} from "date-fns";
import { START_OF_WEEK, YEARS_MINUS } from "../constants";

export type WeekendBucket = {
  year: number;
  weekend: number;
  label: string;
  weekendStart: Date;
  weekendEnd: Date;
  weekendDay: Date;
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
  const end = startOfMonth(addMonths(currentDate, 10));

  const result: Record<string, MonthWithWeekends> = {};
  let current = start;

  // Find the first Tuesday
  while (getDay(current) !== START_OF_WEEK) {
    current = addDays(current, 1);
  }

  const weekendCounterByYear: Record<number, number> = {};

  while (isBefore(current, end)) {
    const monday = current;
    const saturday = addDays(monday, 5);
    const sunday = addDays(monday, 6);

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
      weekendStart: monday,
      weekendEnd: sunday,
      weekendDay: saturday,
      label: `Weekend of ${format(saturday, "MMM d, yyyy")}`,
    });

    current = addDays(current, 7); // next week. first day
  }

  const allMonths = Object.values(result);

  allMonths.pop(); // remove final month
  return allMonths;
}
