import { yearStyling } from "@/app/plan/calendar";
import {
  MonthWithWeekends,
  WeekendBucket,
} from "@/lib/calendar/generate-weekends";
import {
  getConWithYear,
  grabConsFromSupabase,
} from "@/lib/calendar/grab-weekend";
import { usePlanSidebarStore } from "@/stores/sidebar-store";
import { ConventionInfo, ConventionYear } from "@/types/types";

export function CalendarMonthRow({
  monthData,
  conMap,
}: {
  monthData: MonthWithWeekends;
  conMap: Map<string, ConventionInfo[]>;
}) {
  const selectedMonth = usePlanSidebarStore((s) => s.selectedMonth);
  const setSelectedMonth = usePlanSidebarStore((s) => s.setSelectedMonth);
  const setSelectedCons = usePlanSidebarStore((s) => s.setSelectedCons);

  const isSelectedMonth =
    selectedMonth?.year === monthData.year &&
    selectedMonth?.month === monthData.month;

  const monthName = new Date(
    monthData.year,
    monthData.month - 1
  ).toLocaleString("default", {
    month: "long",
  });

  const handleMonthClick = async () => {
    if (isSelectedMonth) {
      setSelectedMonth(null);
      setSelectedCons([]);
    } else {
      setSelectedMonth(monthData);
      const first = monthData.weekends[0];
      const last = monthData.weekends[monthData.weekends.length - 1];

      if (!first || !last) return; // handle empty case just in case

      const conYears: ConventionYear[] = await grabConsFromSupabase(
        first.weekendStart,
        last.weekendEnd
      );
      console.log("conYears: ", conYears);

      setSelectedCons(getConWithYear(conYears));
    }
  };

  return (
    <div className="grid grid-cols-[auto_1fr_1fr] items-start gap-4">
      <h1
        className={`${yearStyling} ${monthData.month === 1 ? "" : "opacity-0"}`}
      >
        {monthData.year}
      </h1>
      <h1
        title={`Cons in ${monthName}, ${monthData.year}`}
        className={`col-start-2 text-lg select-none
       font-sans-header font-semibold text-right cursor-pointer transition-all duration-150 origin-right ${
         isSelectedMonth
           ? "text-secondary"
           : "text-primary-text hover:text-primary-muted hover:scale-105"
       }`}
        onClick={handleMonthClick}
      >
        {monthName}
      </h1>

      <div className="flex gap-4 col-start-3">
        {monthData.weekends.map((weekend, i) => {
          const key = `${weekend.year}-${weekend.weekend}`;
          const cons = conMap.get(key) ?? [];
          const conCount = cons.length;
          return (
            <CalendarWeekendDot
              key={i}
              count={conCount}
              weekendData={weekend}
              isSelectedMonth={isSelectedMonth}
            />
          );
        })}
      </div>
    </div>
  );
}

export function CalendarWeekendDot({
  weekendData,
  isSelectedMonth,
  count,
}: {
  weekendData: WeekendBucket;
  isSelectedMonth: boolean;
  count: number;
}) {
  const selectedWeekend = usePlanSidebarStore((s) => s.selectedWeekend);
  const setSelectedWeekend = usePlanSidebarStore((s) => s.setSelectedWeekend);
  const setSelectedCons = usePlanSidebarStore((s) => s.setSelectedCons);

  const isSelectedWeekend =
    isSelectedMonth ||
    (selectedWeekend?.year === weekendData.year &&
      selectedWeekend?.weekend === weekendData.weekend);

  const now = new Date();
  const isThisWeekend =
    now >= weekendData.weekendStart && now <= weekendData.weekendEnd;
  const hasPassed = weekendData.weekendEnd < now;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 60);

  const isRecentPast = weekendData.weekendEnd >= thirtyDaysAgo;

  const handleWeekendDotClick = async () => {
    if (isSelectedWeekend) {
      setSelectedWeekend(null);
      setSelectedCons([]);
    } else {
      setSelectedWeekend(weekendData);
      const conYears: ConventionYear[] = await grabConsFromSupabase(
        weekendData.weekendStart,
        weekendData.weekendEnd
      );

      setSelectedCons(getConWithYear(conYears));
    }
  };

  return (
    <div
      title={`${weekendData.label}`}
      onClick={handleWeekendDotClick}
      className="flex flex-col items-center gap-2"
    >
      <div
        className={`w-4.5 h-4.5 rounded-full cursor-pointer transition-all duration-150  hover:scale-110 ${
          isSelectedWeekend
            ? isThisWeekend
              ? " outline-4 outline-secondary-darker/80 border-none"
              : " outline-4 outline-secondary border-none"
            : " active:scale-80"
        } ${
          hasPassed
            ? "bg-primary-lightest hover:bg-primary-light"
            : isThisWeekend
            ? "bg-secondary hover:bg-secondary-darker/80"
            : "bg-primary hover:bg-primary-darker/80"
        }`}
      ></div>
      <h1 title="Number of Cons" className="select-none">
        {isRecentPast ? count : "-"}
      </h1>
    </div>
  );
}
