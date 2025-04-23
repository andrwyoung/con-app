import CardList from "@/components/card/card-list/card-list";
import {
  formatMonthYear,
  formatWeekendRange,
} from "@/lib/helpers/display-formatters";
import { useListStore } from "@/stores/list-store";
import { usePlanSidebarStore } from "@/stores/sidebar-store";
import { usePlanGeneralUIStore } from "@/stores/ui-store";
import { ConventionInfo } from "@/types/types";
import { useEffect, useState } from "react";

export default function CalendarMode() {
  const selectedCons = usePlanSidebarStore((s) => s.selectedCalendarCons);
  const clearCalendarSelection = usePlanSidebarStore(
    (s) => s.clearCalendarSelection
  );

  const selectedMonth = usePlanSidebarStore((s) => s.selectedMonth);
  const selectedWeekend = usePlanSidebarStore((s) => s.selectedWeekend);

  const lists = useListStore((s) => s.lists);
  const showingNow = usePlanGeneralUIStore((s) => s.showingNow);

  const [inListCons, setInListCons] = useState<ConventionInfo[]>([]);
  const [notInListCons, setNotInListCons] = useState<ConventionInfo[]>([]);

  let title = "";
  let subtitle = "";
  if (selectedMonth) {
    subtitle = `Month of:`;
    title = formatMonthYear(selectedMonth);
  } else if (selectedWeekend) {
    subtitle = `Week of:`;
    title = formatWeekendRange(selectedWeekend);
  }

  useEffect(() => {
    const currentList = lists[showingNow]?.items ?? [];

    const inList = selectedCons.filter((con) =>
      currentList.some((c) => c.id === con.id)
    );

    const notInList = selectedCons.filter(
      (con) => !currentList.some((c) => c.id === con.id)
    );

    setInListCons(inList);
    setNotInListCons(notInList);
  }, [selectedCons, lists, showingNow]);

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

        <button
          type="button"
          onClick={() => {
            clearCalendarSelection();
          }}
          className="bg-primary-lightest cursor-pointer text-primary-muted uppercase text-xs px-4 py-1 rounded-full hover:bg-primary-light focus:outline-none"
        >
          Deselect
        </button>
      </div>

      {inListCons.length > 0 ? (
        <>
          <h1 className="text-xs font-semibold uppercase tracking-wide text-primary-muted px-2">
            In Current List ({inListCons.length})
          </h1>
          <div className="flex flex-col min-h-0 flex-none">
            <div className="overflow-y-auto max-h-[12rem] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
              <CardList items={inListCons} scope={"plan"} />
            </div>
          </div>

          <h1 className="text-xs font-semibold uppercase tracking-wide text-primary-muted px-2 mt-1">
            Not In List ({notInListCons.length})
          </h1>
        </>
      ) : (
        <h1 className="text-xs font-semibold uppercase tracking-wide text-primary-muted px-2">
          Showing {notInListCons.length} Cons
        </h1>
      )}

      {selectedCons.length > 0 ? (
        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
          <CardList items={notInListCons} scope={"plan"} />
        </div>
      ) : (
        <div className="text-sm text-center text-primary-muted px-2">
          No Dates Selected. <br />
          Click on a Weekend Dot or Month.
        </div>
      )}
    </div>
  );
}
