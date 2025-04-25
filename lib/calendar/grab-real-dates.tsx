import { ConventionInfo } from "@/types/types";
import { log } from "../utils";

export function getRealDates(con: ConventionInfo): {
  start_date: string | null;
  end_date: string | null;
} {
  if (con.specificYear) {
    return {
      start_date: con.specificYear.start_date,
      end_date: con.specificYear.end_date,
    };
  }

  // if it's a prediction (on wishlist) then add a year to the previous year's con
  if (!con.convention_year_id && con.start_date && con.end_date) {
    log("convention has no id. so true dates are a year ahead");
    const start = new Date(con.start_date);
    const end = new Date(con.end_date);

    start.setFullYear(start.getFullYear() + 1);
    end.setFullYear(end.getFullYear() + 1);

    return {
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
    };
  }

  // this use case should only be reached if you added a list from Explore page
  // and haven't yet synced or refreshed the list
  log("con has no specific year and isn't null. returning real dates");
  return {
    start_date: con.start_date ?? null,
    end_date: con.end_date ?? null,
  };
}

export function getRealYear(con: ConventionInfo): number | null {
  if (con.specificYear) {
    return con.specificYear.year;
  }

  if (!con.convention_year_id && con.start_date) {
    // Prediction: add +1 year to the latest known start_date
    const start = new Date(con.start_date);
    return start.getFullYear() + 1;
  }

  // Fallback to the latest real con year
  return con.year ?? null;
}
