// a convention can have multiple years
// so this file contain helps figure out which year we're talking about

import { ConventionInfo } from "@/types/con-types";

export function getRealDates(con: ConventionInfo): {
  start_date: string | null;
  end_date: string | null;
} {
  // 1. specificYear is always the correct dates.
  // Technical note: it might be differetn than latest_start_date. this is by design
  if (con.specificYear) {
    return {
      start_date: con.specificYear.start_date,
      end_date: con.specificYear.end_date,
    };
  }

  // 2. if !convention_year_id this means it's not a "real" convention
  // it means this is a future prediction
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

  // 3. if the previous 2 don't apply, then just take the latest_start_date
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
