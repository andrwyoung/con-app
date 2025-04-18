// the cards themselves. representing a single convention
import React, { forwardRef } from "react";
import { EventInfo } from "@/types/types";
import { IoLocate } from "react-icons/io5";
import { useMapStore } from "@/stores/map-store";
import { ZOOM_USE_DEFAULT } from "@/lib/constants";
import { RiDraggable } from "react-icons/ri";
import Draggable from "./drag-wrapper";
import CardInfo from "./card-info";

export type CardVariant = "default" | "recommendation" | "minimal";

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
      : type === "hover"
      ? "bg-primary-light shadow-lg"
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
      <Draggable con={info}>
        <div
          className={`absolute flex items-center justify-center  bg-primary-light right-0 top-0 h-16 w-6`}
        >
          <RiDraggable className="size-8 text-primary-darker" />
        </div>
      </Draggable>
      <CardInfo info={info} />
      <div className="absolute right-8 bottom-1.5 flex flex-row gap-1 text-primary-muted transition-all">
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
      </div>
    </div>
  );
});
Card.displayName = "Card";

export default Card;
