import { parseISO } from "date-fns";
import { generateWeekendsByMonth, WeekendBucket } from "./generate-weekends";

// simple module-level cache
let cachedWeekendBuckets: WeekendBucket[] | null = null;

export function findWeekendBucket(
  startDateStr?: string | null,
  endDateStr?: string | null
): WeekendBucket | null {
  const rawDate = startDateStr ?? endDateStr;
  if (!rawDate) return null;

  try {
    const date = parseISO(rawDate);

    // memoize all weekends only once
    if (!cachedWeekendBuckets) {
      const allMonths = generateWeekendsByMonth(date);
      cachedWeekendBuckets = allMonths.flatMap((m) => m.weekends);
    }

    const match = cachedWeekendBuckets.find(
      (bucket) => date >= bucket.weekendStart && date <= bucket.weekendEnd
    );

    return match ?? null;
  } catch (err) {
    console.warn("Could not calculate weekend bucket:", err);
    return null;
  }
}
