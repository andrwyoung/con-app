// the cards themselves. representing a single convention
import React, { forwardRef } from "react";
import { EventInfo } from "@/types/types";
import { FiMenu } from "react-icons/fi";
import { IoLocate } from "react-icons/io5";
import { useMapStore } from "@/stores/map-store";
import { ZOOM_USE_DEFAULT } from "@/lib/constants";
import {
  formatEventDates,
  formatShortLocation,
} from "@/lib/helpers/display-formatters";

function PastBadge() {
  return (
    <span className="ml-2 px-1.5 py-0.5 text-xs text-gray-600 bg-gray-100 rounded">
      PAST
    </span>
  );
}

const Card = forwardRef<
  HTMLDivElement,
  {
    info: EventInfo;
    selected?: boolean;
    onClick?: () => void;
  }
>(({ info, selected = false, onClick }, ref) => {
  const flyTo = useMapStore((s) => s.flyTo);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative flex flex-row cursor-pointer items-center w-full h-16 rounded-lg 
    px-4 py-1 overflow-hidden shadow-x transition-all transform
     hover:shadow-[0_0_2px_2px_theme('colors.primary-light.DEFAULT')] group select-none
    ${
      selected
        ? "outline-3 outline-secondary bg-primary-light"
        : "bg-primary-lightest hover:scale-[1.01]"
    }`}
    >
      <div
        className={`absolute top-0 left-0  h-16 w-16  ${
          selected ? "bg-primary/40" : "bg-primary-light"
        }`}
      />
      <div className="flex flex-col ml-15">
        <div className="text-sm font-semibold leading-tight group-hover:text-primary-text line-clamp-1">
          {info.name}
        </div>

        <div className="text-xs text-primary-muted line-clamp-1">
          {formatShortLocation(info.address)}
        </div>
        <div className="text-xs text-primary-muted font-regular line-clamp-1">
          {formatEventDates(info)}
        </div>
      </div>
      <div className="absolute right-6 bottom-2 flex flex-row gap-1 text-primary-muted transition-all">
        <IoLocate
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
        <FiMenu className="hover:scale-110 hover:text-primary-text" />
      </div>
    </div>
  );
});
Card.displayName = "Card";

export default Card;
