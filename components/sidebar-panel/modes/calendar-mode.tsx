import CardList from "@/components/card/card-list/card-list";
import { usePlanSidebarStore } from "@/stores/sidebar-store";

export default function CalendarMode() {
  const selectedCons = usePlanSidebarStore((s) => s.selectedCons);
  const setSelectedCons = usePlanSidebarStore((s) => s.setSelectedCons);

  //
  // const selectedMonth = usePlanSidebarStore((s) => s.selectedMonth);
  // const selectedWeekend = usePlanSidebarStore((s) => s.selectedWeekend);

  const title = "Weekend AAA ";

  return (
    <div className="flex flex-col min-h-0 mt-2 gap-4">
      <div className="flex-none flex flex-row justify-between px-1 items-baseline">
        <h1 className="text-sm font-semibold uppercase tracking-wide text-primary-muted px-1">
          {title} ({selectedCons.length})
        </h1>
        <button
          type="button"
          onClick={() => setSelectedCons([])}
          className="bg-primary-lightest cursor-pointer text-primary-muted uppercase text-xs px-4 py-1 rounded-full hover:bg-primary-light focus:outline-none"
        >
          Deselect
        </button>
      </div>
      <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
        <CardList items={selectedCons} scope={"plan"} />
      </div>
    </div>
  );
}
