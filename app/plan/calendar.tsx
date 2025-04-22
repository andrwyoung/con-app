import { CalendarMonthRow } from "@/components/calendar-panel/calendar-rows";
import {
  generateWeekendsByMonth,
  MonthWithWeekends,
} from "@/lib/calendar/generate-weekends";
import { useEventStore } from "@/stores/all-events-store";
import { useEffect, useRef, useState } from "react";

export const yearStyling =
  "select-none text-primary-muted text-2xl font-semibold";

export default function Calendar() {
  const [visibleYear, setVisibleYear] = useState(new Date().getFullYear());
  const { allEvents, initialized } = useEventStore();
  const [monthsWithCons, setMonthsWithCons] = useState<MonthWithWeekends[]>(
    generateWeekendsByMonth()
  );

  const janRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // when allEvents have been fetched, put them in the weekend
  useEffect(() => {
    if (!initialized) return;

    const consArray = Object.values(allEvents);
    const freshMonths = generateWeekendsByMonth();

    console.log("generating weekends with ", consArray.length, " events");

    const bucketed = freshMonths.map((month) => ({
      ...month,
      weekends: month.weekends.map((weekend) => ({
        ...weekend,
        cons: consArray.filter(
          (con) =>
            con.weekend?.weekend === weekend.weekend &&
            con.weekend?.year === weekend.year
        ),
      })),
    }));
    console.log("bucketed: ", bucketed);

    setMonthsWithCons(bucketed);
  }, [initialized, allEvents]);

  // scrolling behavior: keep current year on top
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

  return (
    <>
      <div
        className="sticky top-0 z-10 px-4 py-2 font-bold bg-gradient-to-b from-white to-transparent
      grid grid-cols-[auto_1fr_1fr] items-end gap-4 border-b select-none"
      >
        <h1 className={`${yearStyling}`}>{visibleYear}</h1>
        <h1 className="text-right font-semibold text-primary-text text-sm"></h1>
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
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white z-10" />

        <div
          ref={scrollContainerRef}
          className="flex flex-col gap-8 h-full max-h-[calc(100vh-16rem)] overflow-y-auto scrollbar-none p-4 overscroll-contain scroll-smooth"
        >
          {monthsWithCons.map((month) => (
            <div
              key={`${month.year}-${month.month}`}
              ref={(el) => {
                if (month.month === 1) janRefs.current[month.year] = el;
              }}
            >
              <CalendarMonthRow monthData={month} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
