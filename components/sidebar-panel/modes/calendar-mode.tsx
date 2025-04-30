// mostly ui related things to do with rendering title cards depending on
// the conventions it's told to render

import CardList from "@/components/card/card-list/card-list";
import {
  formatMonthYear,
  formatWeekendRange,
} from "@/lib/helpers/time/date-formatters";

import { useListStore } from "@/stores/list-store";
import { usePlanSidebarStore } from "@/stores/page-store";
import { ConventionInfo } from "@/types/con-types";
import { useEffect, useState } from "react";

export default function CalendarMode() {
  const selectedCons = usePlanSidebarStore((s) => s.selectedCalendarCons);
  const selectedCalendarPredictions = usePlanSidebarStore(
    (s) => s.selectedCalendarPredictions
  );
  const clearCalendarSelection = usePlanSidebarStore(
    (s) => s.clearCalendarSelection
  );

  const selectedMonth = usePlanSidebarStore((s) => s.selectedMonth);
  const selectedWeekend = usePlanSidebarStore((s) => s.selectedWeekend);

  const lists = useListStore((s) => s.lists);
  const showingNow = useListStore((s) => s.showingNow);

  const [inListCons, setInListCons] = useState<ConventionInfo[]>([]);
  const [notInListCons, setNotInListCons] = useState<ConventionInfo[]>([]);
  const [notInListPredictions, setNotInListPredictions] = useState<
    ConventionInfo[]
  >([]);
  const somethingSelected = selectedWeekend != null || selectedMonth != null;
  const emptyList = selectedCons.length === 0;

  let title = "";
  let subtitle = "";
  if (selectedMonth) {
    subtitle = `Month of:`;
    title = formatMonthYear(selectedMonth);
  } else if (selectedWeekend) {
    subtitle = `Week of:`;
    title = formatWeekendRange(selectedWeekend);
  }

  // seperates lists to display based on if something is in my list
  useEffect(() => {
    const currentList = lists[showingNow]?.items ?? [];

    const inList: ConventionInfo[] = [];
    const notInList: ConventionInfo[] = [];
    const notInListPredictions: ConventionInfo[] = [];

    selectedCons.forEach((con) => {
      const isInList = currentList.some(
        (c) =>
          c.id === con.id && c.convention_year_id === con.convention_year_id
      );
      if (isInList) {
        inList.push(con);
      } else {
        notInList.push(con);
      }
    });

    selectedCalendarPredictions.forEach((con) => {
      const isInList = currentList.some(
        (c) =>
          c.id === con.id && c.convention_year_id === con.convention_year_id
      );
      if (isInList) {
        inList.push(con);
      } else {
        notInListPredictions.push(con);
      }
    });

    setInListCons(inList);
    setNotInListCons(notInList);
    setNotInListPredictions(notInListPredictions);
  }, [selectedCons, selectedCalendarPredictions, lists, showingNow]);

  return (
    <div className="flex flex-col min-h-0 mt-2 gap-2">
      <div className="flex-none flex flex-row justify-between items-start">
        <div className="flex flex-col mb-2">
          <h1 className="text-xs font-semibold uppercase tracking-wide text-primary-muted">
            {subtitle}
          </h1>
          <h1 className="text-md font-semibold uppercase tracking-wide text-primary-muted">
            {title}
          </h1>
        </div>
        {!emptyList ? (
          <button
            type="button"
            onClick={() => {
              clearCalendarSelection();
            }}
            className="bg-primary-lightest cursor-pointer text-primary-muted uppercase text-xs px-4 py-1 rounded-full hover:bg-primary-light focus:outline-none"
          >
            Deselect
          </button>
        ) : null}
      </div>

      <div
        className="overflow-y-auto flex-grow flex flex-col gap-2
       scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent"
      >
        {inListCons.length > 0 ? (
          <>
            <h1 className="text-xs font-semibold uppercase tracking-wide text-primary-muted px-2">
              In Current List ({inListCons.length})
            </h1>
            <CardList items={inListCons} scope={"plan"} />

            <h1 className="text-xs font-semibold uppercase tracking-wide text-primary-muted px-2 mt-1">
              Scheduled Cons ({notInListCons.length})
            </h1>
          </>
        ) : !emptyList ? (
          <h1 className="text-xs font-semibold uppercase tracking-wide text-primary-muted px-2">
            Showing {notInListCons.length} Cons
          </h1>
        ) : null}

        {selectedCons.length > 0 ? (
          <CardList items={notInListCons} scope={"plan"} />
        ) : somethingSelected ? (
          <div className="text-sm text-center text-primary-muted px-2 my-2">
            No Cons Scheduled.
          </div>
        ) : (
          <div className="text-sm text-center text-primary-muted px-2 mt-2">
            No Dates Selected. <br />
            Click on a Weekend Dot or Month.
          </div>
        )}

        {notInListPredictions.length > 0 && (
          <>
            <h1
              title="Happened Last Time around this time"
              className="text-xs font-semibold uppercase tracking-wide text-primary-muted px-2"
            >
              Predictions ({notInListPredictions.length})
            </h1>
            <CardList
              items={notInListPredictions}
              type="prediction"
              scope={"plan"}
            />
          </>
        )}
      </div>
    </div>
  );
}
