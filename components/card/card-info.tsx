// this determines how most the the text and stuff are displayed on the cards

import {
  formatEventDates,
  formatShortLocation,
} from "@/lib/helpers/time/date-formatters";
import { TIME_CATEGORY_LABELS, TimeCategory } from "@/types/time-types";
import { ConventionInfo } from "@/types/con-types";
import { FaStar } from "react-icons/fa6";
import {
  ArtistAlleyStatus,
  artistAlleyStatusLabels,
  getAAStatusColor,
} from "@/types/artist-alley-types";
import { getRealDates } from "@/lib/calendar/grab-real-dates";
import { applyRealAAStatusGuard } from "@/lib/helpers/artist-alley/get-aa-status";

export function StatusDot({ status }: { status: TimeCategory }) {
  const color =
    status === "past"
      ? "bg-violet-400"
      : status === "here"
      ? "bg-emerald-500"
      : status === "upcoming"
      ? "bg-lime-400"
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
  const { end_date } = getRealDates(info);
  const realStatus: ArtistAlleyStatus = applyRealAAStatusGuard(
    end_date,
    info.aaStatus
  );

  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-sm font-semibold leading-tight group-hover:text-primary-text line-clamp-1 mr-6">
        {info.name}
      </div>

      <div className="text-xs text-primary-muted line-clamp-1 mr-9">
        {formatShortLocation(info.location)}
      </div>
      {info.specificYear && info.specificYear.year != info.latest_year ? (
        <div className="flex flex-row items-baseline gap-2 text-xs text-primary-muted font-regular line-clamp-1 mr-8">
          {formatEventDates(
            info.specificYear.year,
            info.specificYear.start_date ?? undefined,
            info.specificYear.end_date ?? undefined
          )}
          <div
            title="Historical Convention"
            className="px-2  bg-stone-400 rounded-lg text-white"
          >
            Hist.
          </div>
        </div>
      ) : !info.convention_year_id ? (
        <div className="flex flex-row items-baseline gap-2 text-xs text-primary-muted font-regular line-clamp-1 mr-8 overflow-hidden">
          <strong className="shrink-0">Last:</strong>
          <p className="truncate whitespace-nowrap overflow-hidden max-w-24">
            {formatEventDates(
              info.latest_year,
              info.latest_start_date ?? undefined,
              info.latest_end_date ?? undefined
            )}
          </p>
          <div
            title="Future Prediction"
            className="shrink-0 px-2 bg-white rounded-lg text-primary-text whitespace-nowrap"
          >
            Fut.
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2 text-xs text-primary-muted font-regular line-clamp-1 mr-8">
          <StatusDot status={info.timeCategory ?? "unknown"} />
          {formatEventDates(
            info.latest_year,
            info.latest_start_date,
            info.latest_end_date
          )}
        </div>
      )}
      <div className="flex gap-1 text-xs text-primary-muted">
        <strong>AA Apps:</strong>
        <div
          title="Artist Alley Status"
          className={`px-2 shrink-0 rounded-full text-xs font-medium 
            ${getAAStatusColor(realStatus)}`}
        >
          {artistAlleyStatusLabels[realStatus]}
        </div>
      </div>
    </div>
  );
}
