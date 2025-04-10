import React from "react";
import { EventInfo } from "@/types/types";

export default function Card({
  info,
  selected = false,
  onClick,
}: {
  info: EventInfo;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative flex flex-row cursor-pointer items-center w-full h-16 rounded-lg 
    bg-primary-lightest px-4 py-1 overflow-hidden shadow-x transition-all duration-200 transform
    hover:scale-[1.01] hover:shadow-[0_0_2px_2px_theme('colors.primary-light.DEFAULT')] group select-none
    ${selected ? "outline-2 outline-primary" : "hover:scale-[1.01]"}
      bg-primary-lightest`}
    >
      <div className="absolute top-0 left-0 bg-primary-light h-16 w-16"></div>
      <div className="flex flex-col ml-15 gap-0.5">
        <div className="text-sm font-semibold leading-tight group-hover:text-primary-text">
          {info.name}
        </div>
        <div className="text-xs text-primary-muted font-regular">
          {info.date}
        </div>
        {/* <div className="text-xs text-primary-muted">{info.venue}</div> */}
      </div>
    </div>
  );
}
