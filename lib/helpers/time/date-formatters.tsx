import {
  MonthWithWeekends,
  WeekendBucket,
} from "@/lib/calendar/generate-weekends";
import { format, parseISO } from "date-fns";

// Apr, 25
// for plan mode when you click on a month
export function formatMonthYear(monthData: MonthWithWeekends): string {
  const date = new Date(monthData.year, monthData.month - 1);
  return format(date, "MMMM, yyy");
}

// Aug 18–24, 2025
// for plan mode when you click on a weekend
export function formatWeekendRange(weekend: WeekendBucket): string {
  const start = weekend.weekendStart;
  const end = weekend.weekendEnd;

  const startMonth = format(start, "MMM");
  const endMonth = format(end, "MMM");
  const startDay = format(start, "d");
  const endDay = format(end, "d");
  const year = format(end, "yyyy");

  const isSameMonth = start.getMonth() === end.getMonth();

  const monthPart = isSameMonth
    ? `${startMonth} ${startDay}–${endDay}`
    : `${startMonth} ${startDay} – ${endMonth} ${endDay}`;

  return `${monthPart}, ${year}`;
}

// Aug 15, '25 or Dec 26-28, '24
// for small card info
export function formatEventDates(
  year: number,
  start?: string,
  end?: string
): string {
  if (!start) return year.toString();

  const startDate = parseISO(start);
  const endDate = end ? parseISO(end) : startDate; // if end date is null, default to same day event

  const sameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  const sameMonthAndYear =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth();

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  if (sameDay) {
    const dateStr = startDate.toLocaleDateString("en-US", options);
    const shortYear = `'${String(startDate.getFullYear()).slice(-2)}`;
    return `${dateStr}, ${shortYear}`;
  }

  if (sameMonthAndYear) {
    return `${startDate.toLocaleDateString(
      "en-US",
      options
    )}–${endDate.getDate()}, '${String(startDate.getFullYear()).slice(-2)}`;
  }

  const startStr = startDate.toLocaleDateString("en-US", options);
  const endStr = endDate.toLocaleDateString("en-US", {
    ...options,
    year:
      startDate.getFullYear() === endDate.getFullYear() ? undefined : "numeric",
  });

  return `${startStr} – ${endStr}, '${String(endDate.getFullYear()).slice(-2)}`;
}

// August 15 - August 16
// used for the year cards
export function formatEventMonthRange(start?: string, end?: string): string {
  if (!start) return ""; // start date is neccesary

  const startDate = parseISO(start);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
  };

  const startStr = startDate.toLocaleDateString("en-US", options);

  // now figure out end date. we allow end to be null for same day events
  if (!end) return startStr;

  const endDate = parseISO(end);
  if (startDate.getTime() === endDate.getTime()) {
    return startStr;
  }

  const endStr = endDate.toLocaleDateString("en-US", options);

  return `${startStr} – ${endStr}`;
}

// get rid of USA for the card info
export function formatShortLocation(fullAddress: string): string {
  const parts = fullAddress.split(",").map((p) => p.trim());
  if (parts.length < 2) return fullAddress;

  // drop USA
  if (parts.length === 3 && parts[2] === "USA") {
    return `${parts[0]}, ${parts[1]}`;
  }

  return parts.join(", ");
}
