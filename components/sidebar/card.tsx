import React, { forwardRef } from "react";
import { EventInfo } from "@/types/types";
import { FiMenu } from "react-icons/fi";
import { IoLocate } from "react-icons/io5";
import { useMapStore } from "@/stores/map-store";

const Card = forwardRef<
  HTMLDivElement,
  {
    info: EventInfo;
    selected?: boolean;
    onClick?: () => void;
    onDoubleClick?: () => void;
  }
>(({ info, selected = false, onClick, onDoubleClick }, ref) => {
  const flyTo = useMapStore((s) => s.flyTo);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative flex flex-row cursor-pointer items-center w-full h-16 rounded-lg 
    bg-primary-lightest px-4 py-1 overflow-hidden shadow-x transition-all transform
     hover:shadow-[0_0_2px_2px_theme('colors.primary-light.DEFAULT')] group select-none
    ${selected ? "outline-2 outline-secondary" : "hover:scale-[1.01]"}
      bg-primary-lightest`}
    >
      <div className="absolute top-0 left-0 bg-primary-light h-16 w-16" />
      <div className="flex flex-col ml-15 gap-0.5">
        <div className="text-sm font-semibold leading-tight group-hover:text-primary-text">
          {info.name}
        </div>
        <div className="text-xs text-primary-muted font-regular">
          {info.date}
        </div>
        {/* <div className="text-xs text-primary-muted">{info.venue}</div> */}
      </div>
      <div className="absolute right-6 bottom-2 flex flex-row gap-1 text-primary-muted transition-all">
        <IoLocate
          className="hover:scale-110 hover:text-primary-text cursor-alias"
          onClick={() =>
            flyTo?.({ longitude: info.longitude, latitude: info.latitude }, 9)
          }
        />
        <FiMenu className="hover:scale-110 hover:text-primary-text" />
      </div>
    </div>
  );
});
Card.displayName = "Card"; // Required when using forwardRef

export default Card;
