import { ConventionInfo } from "@/types/types";

export function getConventionYearId(item: ConventionInfo): string | null {
  if (item.specificYear?.id) return item.specificYear.id;
  return item.convention_year_id ?? null;
}

export function getConventionDates(item: ConventionInfo): {
  start_date: string | null;
  end_date: string | null;
} {
  if (item.specificYear) {
    return {
      start_date: item.specificYear.start_date ?? null,
      end_date: item.specificYear.end_date ?? null,
    };
  }

  return {
    start_date: item.latest_start_date ?? null,
    end_date: item.latest_end_date ?? null,
  };
}

export function isSameListItem(a: ConventionInfo, b: ConventionInfo): boolean {
  return a.id === b.id && getConventionYearId(a) === getConventionYearId(b);
}
