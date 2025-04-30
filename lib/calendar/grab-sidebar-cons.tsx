// given a start and end date, set the global store to contain all the conventions scheduled between those dates
// additionally, grab some predictions (if relevant) to display too

import { ConventionInfo, ConventionYear } from "@/types/con-types";
import { supabaseAnon } from "../supabase/client";
import { useEventStore } from "@/stores/all-events-store";
import { DAYS_UNTIL_PREDICTIONS, MAX_CARDS } from "../constants";
import { log } from "../utils";

export const fetchAndSetCons = async (
  start: Date,
  end: Date,
  setter: (cons: ConventionInfo[]) => void,
  predictionsSetter: (cons: ConventionInfo[]) => void
) => {
  const cleanStart = start.toISOString().split("T")[0];
  const cleanEnd = end.toISOString().split("T")[0];

  // get this year’s cons
  const conYears = await grabConsFromSupabase(cleanStart, cleanEnd);
  const consWithYears = getConWithYear(conYears);
  setter(consWithYears);

  // exit if we've already hit max_cards
  if (consWithYears.length >= MAX_CARDS) {
    predictionsSetter([]);
    return;
  }

  //
  // prediction feature:
  // show people conventions that happened around the same time last year
  const predictionCandidates = await grabPredictedConsFromSupabase(
    cleanStart,
    cleanEnd
  );

  const remainingSlots = MAX_CARDS - consWithYears.length;
  log(
    "prediction candidates: ",
    predictionCandidates,
    " got x slots: ",
    remainingSlots
  );

  // don't show a million predictions
  predictionsSetter(predictionCandidates.slice(0, remainingSlots));
};

export async function grabConsFromSupabase(
  cleanStart: string,
  cleanEnd: string
): Promise<ConventionYear[]> {
  const { data, error } = await supabaseAnon
    .from("convention_years")
    .select("*")
    .not("start_date", "lt", cleanStart)
    .not("start_date", "gt", cleanEnd);

  if (error) {
    console.error("Error grabbing cons for weekend:", error);
    return [];
  }

  return data as ConventionYear[];
}

export function getConWithYear(conYears: ConventionYear[]): ConventionInfo[] {
  const allEvents = useEventStore.getState().allEvents;

  // look up the year in our dict. and be sure to also change the convention_year_id
  return conYears.flatMap((cy) => {
    const info = allEvents[cy.convention_id];
    return info
      ? [{ ...info, specificYear: cy, convention_year_id: cy.id }]
      : [];
  });
}

export async function grabPredictedConsFromSupabase(
  cleanStart: string,
  cleanEnd: string
): Promise<ConventionInfo[]> {
  const today = new Date();
  const startDate = new Date(cleanStart);
  const daysUntilStart =
    (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (daysUntilStart < DAYS_UNTIL_PREDICTIONS) {
    return []; // not far enough out, skip prediction
  }

  // go back 1 year
  const pastStart = new Date(startDate);
  const pastEnd = new Date(cleanEnd);
  pastStart.setFullYear(pastStart.getFullYear() - 1);
  pastEnd.setFullYear(pastEnd.getFullYear() - 1);

  const pastStartISO = pastStart.toISOString().split("T")[0];
  const pastEndISO = pastEnd.toISOString().split("T")[0];

  // fetch last year’s cons
  const { data, error } = await supabaseAnon
    .from("convention_years")
    .select("*")
    .not("start_date", "lt", pastStartISO)
    .not("start_date", "gt", pastEndISO);

  if (error || !data) {
    console.error("Error grabbing past cons:", error);
    return [];
  }
  log("1 year back: ", data);

  const allEvents = useEventStore.getState().allEvents;

  // filter out ones that already exist this year
  return (data as ConventionYear[])
    .filter((cy) => {
      const info = allEvents[cy.convention_id];
      return info?.latest_year === cy.year; // keep only if the latest year is this one
    })
    .map((cy) => {
      const info = allEvents[cy.convention_id];
      if (!info) return null;

      // there are predictions, so it's important we strip out any associated years
      const cloned = { ...info };
      delete cloned.specificYear;
      delete (cloned as ConventionInfo).convention_year_id;

      return cloned;
    })
    .filter((info): info is ConventionInfo => !!info);
}

// grabs corresponding conInfo and also filters out stuff
export function getPredictionConInfo(
  conYears: ConventionYear[]
): ConventionInfo[] {
  const allEvents = useEventStore.getState().allEvents;

  return conYears.flatMap((cy) => {
    const info = allEvents[cy.convention_id];
    if (!info) return [];

    const cloned = { ...info }; // avoid mutating original
    delete cloned.specificYear;
    delete (cloned as ConventionInfo).convention_year_id; // just in case

    return [cloned];
  });
}
