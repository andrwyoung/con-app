// the scrollable calendar itself
// in charge of all the logic related to selected and scrolling cons (lots of useEffects)

import { CalendarMonthRow } from "@/components/calendar-panel/calendar-rows";
import { findWeekendBucket } from "@/lib/calendar/determine-weekend";
import { generateWeekendsByMonth } from "@/lib/calendar/generate-weekends";
import { getRealDates } from "@/lib/calendar/grab-real-dates";
import { fetchAndSetCons } from "@/lib/calendar/grab-sidebar-cons";
import { log } from "@/lib/utils";
import { useEventStore } from "@/stores/all-events-store";
import { useListStore } from "@/stores/list-store";
import {
  usePlanSelectedCardsStore,
  usePlanSidebarStore,
} from "@/stores/page-store";
import { ConventionInfo } from "@/types/con-types";
import { useEffect, useMemo, useRef, useState } from "react";

export const yearStyling =
  "select-none text-primary-muted text-2xl font-semibold";

const scrollElementIntoCenter = (
  container: HTMLElement,
  target: HTMLElement,
  smooth: boolean = false
) => {
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const scrollTop =
    container.scrollTop +
    (targetRect.top - containerRect.top) -
    container.clientHeight / 2 +
    target.clientHeight / 2;

  if (smooth) {
    container.scrollTo({ top: scrollTop, behavior: "smooth" });
  } else {
    container.scrollTop = scrollTop;
  }
};

export default function Caly({
  sidebarRef,
}: {
  sidebarRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [visibleYear, setVisibleYear] = useState(new Date().getFullYear());
  const months = useMemo(() => generateWeekendsByMonth(), []);
  const selectedWeekend = usePlanSidebarStore((s) => s.selectedWeekend);
  const setSelectedWeekend = usePlanSidebarStore((s) => s.setSelectedWeekend);
  const setSelectedCalendarCons = usePlanSidebarStore(
    (s) => s.setSelectedCalendarCons
  );
  const clearCalendarSelection = usePlanSidebarStore(
    (s) => s.clearCalendarSelection
  );
  const setSelectedCalendarPredictions = usePlanSidebarStore(
    (s) => s.setSelectedCalendarPredictions
  );
  const selectedMonth = usePlanSidebarStore((s) => s.selectedMonth);

  const lists = useListStore((s) => s.lists);
  const showingNow = useListStore((s) => s.showingNow);
  const eventsInitailized = useEventStore((s) => s.initialized);
  const selectedCon = usePlanSelectedCardsStore((s) => s.selectedCon);

  const janRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const monthRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const allWeekends = months.flatMap((m) => m.weekends);
  const today = new Date();
  const thisWeekend = allWeekends.find((w) => w.weekendEnd >= today);

  const [weekendConMap, setWeekendConMap] = useState<
    Map<string, ConventionInfo[]>
  >(new Map());

  // // select current year on init
  // const { scrolledToToday, setScrolledToToday } = usePlanUIStore();
  // useEffect(() => {
  //   log("here's what thisWeekend looks like: ", thisWeekend);
  //   if (!thisWeekend || scrolledToToday) {
  //     return;
  //   }
  //   log("setting scrolledToToday to be true");
  //   setSelectedWeekend(thisWeekend);
  //   setScrolledToToday(true);
  // }, [
  //   months,
  //   thisWeekend,
  //   setSelectedWeekend,
  //   scrolledToToday,
  //   setScrolledToToday,
  // ]);

  // mapping all conventions to their weekend
  useEffect(() => {
    const map = new Map<string, ConventionInfo[]>();
    const consArray = lists[showingNow].items;

    for (const con of consArray) {
      const { start_date, end_date } = getRealDates(con);
      const bucket = findWeekendBucket(start_date, end_date);
      const key = bucket ? `${bucket.year}-${bucket.weekend}` : null;
      if (!key) continue;

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(con);
    }

    setWeekendConMap(map);
  }, [lists, showingNow]);

  // KEY SECTION: if selectedWeekend or selectedMonth change, then populate the sidebar
  useEffect(() => {
    const fetchConventions = async () => {
      // weekends
      log("fetching the weekend/month");
      if (selectedWeekend) {
        fetchAndSetCons(
          selectedWeekend.weekendStart,
          selectedWeekend.weekendEnd,
          setSelectedCalendarCons,
          setSelectedCalendarPredictions
        );
        return;
      }

      // months
      if (selectedMonth && selectedMonth.weekends.length > 0) {
        const first = selectedMonth.weekends[0];
        const last = selectedMonth.weekends[selectedMonth.weekends.length - 1];
        fetchAndSetCons(
          first.weekendStart,
          last.weekendEnd,
          setSelectedCalendarCons,
          setSelectedCalendarPredictions
        );
        return;
      }

      // If neither is selected, clear results
      clearCalendarSelection();
    };

    if (eventsInitailized) {
      fetchConventions();
    }
  }, [
    selectedWeekend,
    selectedMonth,
    setSelectedCalendarCons,
    eventsInitailized,
    setSelectedCalendarPredictions,
    clearCalendarSelection,
  ]);

  // when an items gets selected, highlight that weekend
  useEffect(() => {
    if (selectedCon) {
      const { start_date, end_date } = getRealDates(selectedCon);
      const bucket = findWeekendBucket(start_date, end_date);
      setSelectedWeekend(bucket);
    }
  }, [selectedCon, setSelectedWeekend]);

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

      if (scrollEl && scrollContainerRef.current) {
        scrollElementIntoCenter(scrollContainerRef.current, scrollEl, true);
      }

      sidebarRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [months, selectedWeekend, selectedMonth, sidebarRef]);

  // the today button
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
     flex flex-row justify-between items-center gap-4 border select-none rounded-t"
      >
        <div className="flex items-center min-w-[4rem]">
          <h1 className={`${yearStyling}`}>{visibleYear}</h1>
        </div>
        <button
          type="button"
          onClick={handleScrollToToday}
          className="bg-primary-lightest cursor-pointer text-primary-muted uppercase text-xs px-4 py-0.5 border-2 border-primary rounded-full hover:bg-primary-light focus:outline-none"
        >
          Today
        </button>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5 rounded-lg" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white z-5 rounded-lg" />

        <div
          ref={scrollContainerRef}
          className="flex flex-col gap-8 h-full max-h-[calc(100dvh-12rem)] md:max-h-[calc(100dvh-20rem)] overflow-y-auto scrollbar-none p-4 "
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
