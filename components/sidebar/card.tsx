// the cards themselves. representing a single convention
import React, { forwardRef } from "react";
import { EventInfo } from "@/types/types";
import { IoLocate } from "react-icons/io5";
import { useMapStore } from "@/stores/map-store";
import { ZOOM_USE_DEFAULT } from "@/lib/constants";
import {
  formatEventDates,
  formatShortLocation,
} from "@/lib/helpers/display-formatters";
import {
  TIME_CATEGORY_LABELS,
  TimeCategory,
} from "@/lib/helpers/event-recency";
import { FaStar } from "react-icons/fa6";

export type CardVariant = "default" | "recommendation" | "minimal";

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

const Card = forwardRef<
  HTMLDivElement,
  {
    info: EventInfo;
    selected?: boolean;
    onClick?: () => void;
    type?: string;
  }
>(({ info, selected = false, onClick, type }, ref) => {
  const flyTo = useMapStore((s) => s.flyTo);

  const baseClass =
    "relative flex flex-row cursor-pointer border border-primary-darker/40 items-center w-full h-16 rounded-lg px-4 py-1 overflow-hidden transition-all transform group select-none";
  const variantClass =
    type === "recommendation"
      ? selected
        ? "outline-3 outline-primary bg-white "
        : "bg-white hover:scale-[1.01] shadow-xs"
      : selected
      ? "outline-3 outline-secondary bg-primary-light"
      : "bg-primary-lightest hover:scale-[1.01] shadow-xs";

  return (
    <div ref={ref} onClick={onClick} className={`${baseClass} ${variantClass}`}>
      <div
        className={`absolute top-0 left-0  h-16 w-16  ${
          selected ? "bg-primary-light" : "bg-primary-lightest"
        }`}
      />
      <div className="flex flex-col ml-15">
        <div className="text-sm font-semibold leading-tight group-hover:text-primary-text line-clamp-1">
          {info.name}
        </div>

        <div className="text-xs text-primary-muted line-clamp-1">
          {formatShortLocation(info.location)}
        </div>
        <div className="flex flex-row items-center gap-2 text-xs text-primary-muted font-regular line-clamp-1">
          <StatusDot status={info.timeCategory ?? "unknown"} />
          {formatEventDates(info)}
        </div>
      </div>
      <div className="absolute right-4 bottom-1.5 flex flex-row gap-1 text-primary-muted transition-all">
        <IoLocate
          aria-label="Fly to Location"
          title="Fly to Location"
          className="hover:scale-110 hover:text-primary-text cursor-alias"
          onClick={(e) => {
            // if the target button is clicked, then fly to it. but don't deselect the card itself
            e.stopPropagation();
            flyTo?.(
              { longitude: info.location_long, latitude: info.location_lat },
              ZOOM_USE_DEFAULT
            );
          }}
        />
        {/* <FiMenu className="hover:scale-110 hover:text-primary-text" /> */}
      </div>
    </div>
  );
});
Card.displayName = "Card";

export default Card;
