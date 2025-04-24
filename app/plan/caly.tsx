import { CalendarMonthRow } from "@/components/calendar-panel/calendar-rows";
import { generateWeekendsByMonth } from "@/lib/calendar/generate-weekends";
import {
  getConWithYear,
  grabConsFromSupabase,
} from "@/lib/calendar/grab-weekend";
import { log } from "@/lib/utils";
import { useEventStore } from "@/stores/all-events-store";
import { useListStore } from "@/stores/list-store";
import { usePlanSidebarStore } from "@/stores/sidebar-store";
import { usePlanGeneralUIStore, usePlanUIStore } from "@/stores/ui-store";
import { ConventionInfo } from "@/types/types";
import { useEffect, useMemo, useRef, useState } from "react";

export const yearStyling =
  "select-none text-primary-muted text-2xl font-semibold";

export default function Caly() {
  const [visibleYear, setVisibleYear] = useState(new Date().getFullYear());
  const months = useMemo(() => generateWeekendsByMonth(), []);
  const selectedWeekend = usePlanSidebarStore((s) => s.selectedWeekend);
  const setSelectedWeekend = usePlanSidebarStore((s) => s.setSelectedWeekend);
  const setSelectedCalendarCons = usePlanSidebarStore(
    (s) => s.setSelectedCalendarCons
  );
  const selectedMonth = usePlanSidebarStore((s) => s.selectedMonth);

  const lists = useListStore((s) => s.lists);
  const showingNow = usePlanGeneralUIStore((s) => s.showingNow);
  const eventsInitailized = useEventStore((s) => s.initialized);

  const janRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const monthRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const allWeekends = months.flatMap((m) => m.weekends);
  const today = new Date();
  const thisWeekend = allWeekends.find((w) => w.weekendEnd >= today);

  const [weekendConMap, setWeekendConMap] = useState<
    Map<string, ConventionInfo[]>
  >(new Map());

  // select current year on init
  const { scrolledToToday, setScrolledToToday } = usePlanUIStore();
  useEffect(() => {
    if (!thisWeekend || scrolledToToday) {
      return;
    }
    setSelectedWeekend(thisWeekend);
    setScrolledToToday(true);
  }, [
    months,
    thisWeekend,
    setSelectedWeekend,
    scrolledToToday,
    setScrolledToToday,
  ]);

  // scroll into view when selecting a map item (a month or a weekend-dot)
  useEffect(() => {
    if (!selectedWeekend && !selectedMonth) return;

    let matchingMonth = null;
    if (selectedWeekend) {
      matchingMonth = months.find((m) =>
        m.weekends.some(
          (w) =>
            w.weekend === selectedWeekend.weekend &&
            w.year === selectedWeekend.year
        )
      );
    } else if (selectedMonth) {
      matchingMonth = selectedMonth;
    }

    if (matchingMonth) {
      const scrollEl =
        monthRefs.current[`${matchingMonth.year}-${matchingMonth.month}`];
      scrollEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [months, selectedWeekend, selectedMonth]);

  // // if someone external selects on a con, also select that weekend
  // useEffect(() => {
  //   if (!selectedCon || !selectedCon.weekend) return;

  //   const matchingWeekend = allWeekends.find(
  //     (w) =>
  //       w.weekend === selectedCon.weekend?.weekend &&
  //       w.year === selectedCon.weekend?.year
  //   );

  //   if (!matchingWeekend) return;

  //   setSelectedWeekend(matchingWeekend);
  // }, [selectedCon, setSelectedWeekend, allWeekends]);

  // if selectedWeekend or selectedMonth change, then populate the sidebar
  useEffect(() => {
    const fetchConventions = async () => {
      log("fetching the weekend/month");
      if (selectedWeekend) {
        const conYears = await grabConsFromSupabase(
          selectedWeekend.weekendStart,
          selectedWeekend.weekendEnd
        );
        setSelectedCalendarCons(getConWithYear(conYears));
        return;
      }

      if (selectedMonth && selectedMonth.weekends.length > 0) {
        const first = selectedMonth.weekends[0];
        const last = selectedMonth.weekends[selectedMonth.weekends.length - 1];
        const conYears = await grabConsFromSupabase(
          first.weekendStart,
          last.weekendEnd
        );
        setSelectedCalendarCons(getConWithYear(conYears));
        return;
      }

      // If neither is selected, clear results
      setSelectedCalendarCons([]);
    };

    if (eventsInitailized) {
      fetchConventions();
    }
  }, [
    selectedWeekend,
    selectedMonth,
    setSelectedCalendarCons,
    eventsInitailized,
  ]);

  // mapping all conventions to their weekend
  useEffect(() => {
    const map = new Map<string, ConventionInfo[]>();
    const consArray = lists[showingNow].items;

    for (const con of consArray) {
      const key = con.weekend
        ? `${con.weekend.year}-${con.weekend.weekend}`
        : null;
      if (!key) continue;

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(con);
    }

    setWeekendConMap(map);
  }, [lists, showingNow]);

  // scrolling behavior: keep current year in the header
  useEffect(() => {
    const handleScroll = () => {
      const containerTop =
        scrollContainerRef.current?.getBoundingClientRect().top ?? 0;

      let latestVisibleYear = visibleYear;
      for (const yearStr of Object.keys(janRefs.current)) {
        const year = parseInt(yearStr, 10);
        const el = janRefs.current[year];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= containerTop + 1) {
            // +1 to allow for rounding issues
            latestVisibleYear = year;
          }
        }
      }

      if (latestVisibleYear !== visibleYear) {
        setVisibleYear(latestVisibleYear);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [visibleYear]);

  const handleScrollToToday = () => {
    if (!thisWeekend) return;

    const matchingMonth = months.find((m) =>
      m.weekends.some(
        (w) => w.weekend === thisWeekend.weekend && w.year === thisWeekend.year
      )
    );

    if (matchingMonth) {
      const scrollEl =
        monthRefs.current[`${matchingMonth.year}-${matchingMonth.month}`];
      scrollEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="border-b rounded-lg">
      <div
        className="sticky top-0 z-10 px-4 py-2 font-bold bg-gradient-to-b from-white to-transparent
      grid grid-cols-[auto_1fr_1fr] items-end gap-4 border select-none rounded-t"
      >
        <h1 className={`${yearStyling}`}>{visibleYear}</h1>
        <div className="col-start-2 justify-self-end">
          <button
            type="button"
            onClick={handleScrollToToday}
            className="bg-primary-lightest cursor-pointer text-primary-muted uppercase text-xs px-4 py-0.5 border-2 border-primary rounded-full hover:bg-primary-light focus:outline-none"
          >
            Today
          </button>
        </div>

        <div className="flex flex-col">
          <h1 className="font-semibold text-primary-muted text-sm">
            Weekend Number:
          </h1>
          <h1 className="px-1 flex gap-6 justify-start col-start-3 font-bold text-primary-muted">
            {[1, 2, 3, 4, 5].map((num) => (
              <span key={num}>{num}</span>
            ))}
          </h1>
        </div>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5 rounded-lg" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white z-5 rounded-lg" />

        <div
          ref={scrollContainerRef}
          className="flex flex-col gap-8 h-full max-h-[calc(100vh-16rem)] overflow-y-auto scrollbar-none p-4 "
        >
          {months.map((month) => (
            <div
              key={`${month.year}-${month.month}`}
              ref={(el) => {
                if (month.month === 1) janRefs.current[month.year] = el;
                monthRefs.current[`${month.year}-${month.month}`] = el;
              }}
            >
              <CalendarMonthRow monthData={month} conMap={weekendConMap} />
            </div>
          ))}
          <div className="h-40 shrink-0" />
        </div>
      </div>
    </div>
  );
}
