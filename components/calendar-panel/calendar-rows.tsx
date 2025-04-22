import { yearStyling } from "@/app/plan/calendar";
import {
  MonthWithWeekends,
  WeekendBucket,
} from "@/lib/calendar/generate-weekends";
import { usePlanSidebarStore } from "@/stores/sidebar-store";

export function CalendarMonthRow({
  monthData,
}: {
  monthData: MonthWithWeekends;
}) {
  const selectedMonth = usePlanSidebarStore((s) => s.selectedMonth);
  const setSelectedMonth = usePlanSidebarStore((s) => s.setSelectedMonth);

  const isSelectedMonth =
    selectedMonth?.year === monthData.year &&
    selectedMonth?.month === monthData.month;

  const monthName = new Date(
    monthData.year,
    monthData.month - 1
  ).toLocaleString("default", {
    month: "long",
  });

  const handleMonthClick = () => {
    if (isSelectedMonth) {
      setSelectedMonth(null);
    } else {
      setSelectedMonth(monthData);
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
        {monthData.weekends.map((weekend, i) => (
          <CalendarWeekendDot
            key={i}
            weekendData={weekend}
            isSelectedMonth={isSelectedMonth}
          />
        ))}
      </div>
    </div>
  );
}

export function CalendarWeekendDot({
  weekendData,
  isSelectedMonth,
}: {
  weekendData: WeekendBucket;
  isSelectedMonth: boolean;
}) {
  const selectedWeekend = usePlanSidebarStore((s) => s.selectedWeekend);
  const setSelectedWeekend = usePlanSidebarStore((s) => s.setSelectedWeekend);

  const isSelectedWeekend =
    selectedWeekend?.year === weekendData.year &&
    selectedWeekend?.weekend === weekendData.weekend;

  const handleWeekendDotClick = () => {
    if (isSelectedWeekend) {
      setSelectedWeekend(null);
    } else {
      setSelectedWeekend(weekendData);
      console.log(weekendData);
    }
  };

  return (
    <div
      title={`${weekendData.label}`}
      onClick={handleWeekendDotClick}
      className="flex flex-col items-center"
    >
      <div
        className={`w-4.5 h-4.5 rounded-full cursor-pointer transition-all duration-150  hover:scale-110 ${
          isSelectedWeekend || isSelectedMonth
            ? "bg-primary outline-4 outline-secondary border-none hover:bg-primary-darker/80"
            : "bg-primary hover:bg-primary-darker/80 active:scale-80"
        }`}
      ></div>
      <h3 className="text-md font-semibold text-primary-muted">
        {weekendData.cons?.length ?? 0}
      </h3>
    </div>
  );
}
