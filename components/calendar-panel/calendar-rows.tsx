// the individual rows and dots of the calendar view
// in charge of just sending up whenever something gets clicked

import { yearStyling } from "@/app/plan/caly";
import {
  MonthWithWeekends,
  WeekendBucket,
} from "@/lib/calendar/generate-weekends";
import { usePlanSidebarStore } from "@/stores/page-store";
import {
  ArtistAlleyStatus,
  getAAStatusDarkColor,
} from "@/types/artist-alley-types";
import { ConventionInfo } from "@/types/con-types";
import { FaRegCalendar } from "react-icons/fa6";

export function CalendarMonthRow({
  monthData,
  conMapLists,
  conMapAA,
}: {
  monthData: MonthWithWeekends;
  conMapLists: Map<string, ConventionInfo[]>;
  conMapAA: Map<string, ConventionInfo[]>;
}) {
  const selectedMonth = usePlanSidebarStore((s) => s.selectedMonth);
  const setSelectedMonth = usePlanSidebarStore((s) => s.setSelectedMonth);
  const setSidebarMode = usePlanSidebarStore((s) => s.setSidebarMode);

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
    setSidebarMode("calendar");
    if (isSelectedMonth) {
      setSelectedMonth(null);
    } else {
      setSelectedMonth(monthData);
    }
  };

  return (
    <div className="grid grid-cols-[0fr_6rem_1fr] md:grid-cols-[3rem_7rem_1fr] items-start gap-4">
      <h1
        className={` hidden md:block ${yearStyling} ${
          monthData.month === 1 ? "" : "opacity-0"
        }`}
      >
        {monthData.year}
      </h1>
      <h1
        title={`Cons in ${monthName}, ${monthData.year}`}
        className={`col-start-2 text-md md:text-lg select-none
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
          const listCons = conMapLists.get(key) ?? [];

          const aaCons = conMapAA.get(key) ?? [];
          const aaStatusCounts = aaCons.reduce((acc, con) => {
            const status = con.aaStatus ?? "unknown";
            acc[status] = (acc[status] ?? 0) + 1;
            return acc;
          }, {} as Record<ArtistAlleyStatus, number>);
          return (
            <CalendarWeekendDot
              key={i}
              count={listCons.length}
              weekendData={weekend}
              aaStatusCounts={aaStatusCounts}
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
  aaStatusCounts,
}: {
  weekendData: WeekendBucket;
  isSelectedMonth: boolean;
  count: number;
  aaStatusCounts: Record<ArtistAlleyStatus, number>;
}) {
  const selectedWeekend = usePlanSidebarStore((s) => s.selectedWeekend);
  const setSelectedWeekend = usePlanSidebarStore((s) => s.setSelectedWeekend);
  const setSidebarMode = usePlanSidebarStore((s) => s.setSidebarMode);

  const isSelectedWeekend =
    isSelectedMonth ||
    (selectedWeekend?.year === weekendData.year &&
      selectedWeekend?.weekend === weekendData.weekend);

  const now = new Date();
  const isThisWeekend =
    now >= weekendData.weekendStart && now <= weekendData.weekendEnd;
  const hasPassed = weekendData.weekendEnd < now;
  const daysUntilWeekend = Math.floor(
    (weekendData.weekendStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isOver120DaysOut = daysUntilWeekend > 140;

  const handleWeekendDotClick = async () => {
    setSidebarMode("calendar");
    if (isSelectedWeekend) {
      setSelectedWeekend(null);
    } else {
      setSelectedWeekend(weekendData);
    }
  };

  return (
    <div
      title={`${weekendData.label}`}
      onClick={handleWeekendDotClick}
      className="flex flex-col items-center gap-2"
    >
      <div
        className={`w-5 md:w-14 h-5 md:h-6 flex items-center gap-1 justify-center rounded-full cursor-pointer transition-all duration-200 hover:scale-115
          text-xs text-primary-text ${
            isSelectedWeekend
              ? isThisWeekend
                ? " outline-4 outline-secondary-darker/80 border-none"
                : " outline-4 outline-secondary border-none"
              : " active:scale-90"
          } ${
          hasPassed
            ? "bg-primary-lightest hover:bg-primary"
            : isThisWeekend
            ? "bg-secondary hover:bg-secondary-darker/80"
            : isOver120DaysOut
            ? "bg-primary-light hover:bg-primary/80"
            : "bg-primary hover:bg-primary-darker/80"
        }`}
      >
        <FaRegCalendar className="hidden md:block text-primary-text/70 w-3 h-3" />
        <p className="hidden md:block">{weekendData.weekendDay.getDate()}</p>
      </div>

      <div className="flex flex-col  justify-center">
        {Object.entries(aaStatusCounts).map(([status, count]) =>
          count > 0 ? (
            <div key={status} className="flex flex-row gap-1 items-center ">
              <div
                title={`${count} ${status}`}
                className={`w-2 h-2 rounded-full ${getAAStatusDarkColor(
                  status as ArtistAlleyStatus
                )}`}
              />
              <p className="text-xs text-primary-text">{count}</p>
            </div>
          ) : null
        )}
        <h1
          title="Number of Cons"
          className="select-none text-sm text-primary-muted"
        >
          {count != 0 ? (
            <div className="flex flex-row gap-1 items-center ">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <p className="text-xs text-primary-text">{count}</p>
            </div>
          ) : (
            ""
          )}
        </h1>
      </div>
    </div>
  );
}
