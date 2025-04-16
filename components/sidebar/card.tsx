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

export type CardVariant = "default" | "recommendation" | "minimal";

function StatusDot({ status }: { status: TimeCategory }) {
  const color =
    status === "past"
      ? "bg-slate-300"
      : status === "recent"
      ? "bg-sky-300"
      : status === "here"
      ? "bg-emerald-400"
      : status === "soon"
      ? "bg-orange-300"
      : status === "upcoming"
      ? "bg-stone-300"
      : status === "postponed"
      ? "bg-secondary"
      : status === "discontinued"
      ? "bg-red-400"
      : status === "cancelled"
      ? "bg-red-400"
      : "bg-red-800";

  return (
    <div
      className={`w-2 h-2 rounded-full transform translate-y-[1px] ${color}`}
      title={TIME_CATEGORY_LABELS[status]}
      aria-label={TIME_CATEGORY_LABELS[status]}
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
    "relative flex flex-row cursor-pointer border items-center w-full h-16 rounded-lg px-4 py-1 overflow-hidden transition-all transform group select-none";
  const variantClass =
    type === "recommendation"
      ? selected
        ? "outline-3 outline-secondary bg-white "
        : "bg-white hover:scale-[1.01] shadow-xs"
      : selected
      ? "outline-3 outline-secondary bg-primary-light"
      : "bg-primary-lightest hover:scale-[1.01] shadow-xs";

  return (
    <div ref={ref} onClick={onClick} className={`${baseClass} ${variantClass}`}>
      <div
        className={`absolute top-0 left-0  h-16 w-16  ${
          selected ? "bg-stone-200" : "bg-primary-lightest"
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
