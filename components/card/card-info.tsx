import {
  formatEventDates,
  formatShortLocation,
} from "@/lib/helpers/time/date-formatters";
import { TIME_CATEGORY_LABELS, TimeCategory } from "@/types/time-types";
import { ConventionInfo } from "@/types/types";
import { FaStar } from "react-icons/fa6";

export function StatusDotTester() {
  return (
    <div className="p-4 flex flex-col gap-1">
      {Object.entries(TIME_CATEGORY_LABELS).map(([key, label]) => (
        <div key={key} className="flex items-center gap-2">
          <StatusDot status={key as TimeCategory} />
          <span className="text-sm text-primary-text">{label}</span>
          <code className="text-xs text-primary-muted">({key})</code>
        </div>
      ))}
    </div>
  );
}

function StatusDot({ status }: { status: TimeCategory }) {
  const color =
    status === "past"
      ? "bg-violet-400"
      : status === "recent"
      ? "bg-blue-300"
      : status === "here"
      ? "bg-emerald-500"
      : status === "soon"
      ? "bg-green-400"
      : status === "upcoming"
      ? "bg-lime-400"
      : status === "postponed"
      ? "bg-orange-300"
      : status === "discontinued"
      ? "bg-slate-300"
      : status === "cancelled"
      ? "bg-red-400"
      : "bg-white border shadow-sm";

  return status !== "here" ? (
    <div
      className={`w-2 h-2 rounded-full transform translate-y-[1px] ${color}`}
      title={TIME_CATEGORY_LABELS[status]}
      aria-label={TIME_CATEGORY_LABELS[status]}
    />
  ) : (
    <FaStar
      className="w-3 h-3 text-emerald-500 transform"
      title={TIME_CATEGORY_LABELS[status]}
    />
  );
}

export default function CardInfo({ info }: { info: ConventionInfo }) {
  return (
    <>
      <div className="text-sm font-semibold leading-tight group-hover:text-primary-text line-clamp-1 mb-0.5 mr-8">
        {info.name}
      </div>

      <div className="text-xs text-primary-muted line-clamp-1 mr-9">
        {formatShortLocation(info.location)}
      </div>
      {info.specificYear && info.specificYear.year != info.year ? (
        <div className="flex flex-row items-baseline gap-2 text-xs text-primary-muted font-regular line-clamp-1 mr-8">
          {formatEventDates(
            info.specificYear.year,
            info.specificYear.start_date ?? undefined,
            info.specificYear.end_date ?? undefined
          )}
          <div className="px-2  bg-stone-400 rounded-lg text-white">
            Historical
          </div>
        </div>
      ) : !info.convention_year_id ? (
        <div className="flex flex-row items-baseline gap-2 text-xs text-primary-muted font-regular line-clamp-1 mr-8 overflow-hidden">
          <strong className="shrink-0">Last:</strong>
          <p className="truncate whitespace-nowrap overflow-hidden max-w-24">
            {formatEventDates(
              info.year,
              info.start_date ?? undefined,
              info.end_date ?? undefined
            )}
          </p>
          <div className="shrink-0 px-2 bg-primary rounded-lg text-primary-text whitespace-nowrap">
            Prediction
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2 text-xs text-primary-muted font-regular line-clamp-1 mr-8">
          <StatusDot status={info.timeCategory ?? "unknown"} />
          {formatEventDates(info.year, info.start_date, info.end_date)}
        </div>
      )}
    </>
  );
}
