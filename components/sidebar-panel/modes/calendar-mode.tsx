import CardList from "@/components/card/card-list/card-list";
import { usePlanSidebarStore } from "@/stores/sidebar-store";
import { ConventionInfo } from "@/types/types";
import React, { useEffect, useState } from "react";

export default function CalendarMode() {
  const { selectedMonth, selectedWeekend } = usePlanSidebarStore();

  const [events, setEvents] = useState<ConventionInfo[]>([]);

  useEffect(() => {
    if (selectedWeekend?.cons) {
      setEvents(selectedWeekend.cons);
    } else if (selectedMonth?.weekends) {
      const allCons = selectedMonth.weekends.flatMap((w) => w.cons ?? []);
      setEvents(allCons);
    } else {
      setEvents([]);
    }
  }, [selectedMonth, selectedWeekend]);

  return (
    <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
      <CardList items={events} scope={"plan"} />
    </div>
  );
}
