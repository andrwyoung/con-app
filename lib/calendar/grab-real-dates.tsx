// since we're handling historical and predictive conventions these functions gets the actual dates
//
// OVERVIEW:
// 1. specificYear is always the correct dates. Note: by design it might conflict with latest_start_date etc.
// 2. if !convention_year_id this is an indication that this is on a wishList
// 3. if that doesn't exist then we want the latest dates, which is just stored in ConventionInfo

import { ConventionInfo } from "@/types/con-types";

export function getRealDates(con: ConventionInfo): {
  start_date: string | null;
  end_date: string | null;
} {
  // has specificYear
  if (con.specificYear) {
    return {
      start_date: con.specificYear.start_date,
      end_date: con.specificYear.end_date,
    };
  }

  // prediction
  if (!con.convention_year_id && con.latest_start_date && con.latest_end_date) {
    // log("convention has no id. so true dates are a year ahead");
    const start = new Date(con.latest_start_date);
    const end = new Date(con.latest_end_date);

    start.setFullYear(start.getFullYear() + 1);
    end.setFullYear(end.getFullYear() + 1);

    return {
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
    };
  }

  // if no specicYear
  // log("con has no specific year and isn't null. returning real dates");
  return {
    start_date: con.latest_start_date ?? null,
    end_date: con.latest_end_date ?? null,
  };
}

export function getRealYear(con: ConventionInfo): number | null {
  // has specificYear
  if (con.specificYear) {
    return con.specificYear.year;
  }

  if (!con.convention_year_id && con.latest_start_date) {
    // prediction
    const start = new Date(con.latest_start_date);
    return start.getFullYear() + 1;
  }

  // if no specicYear
  return con.latest_year ?? null;
}
