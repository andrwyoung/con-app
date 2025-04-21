// the cards themselves. representing a single convention
import React, { forwardRef } from "react";
import { ConventionInfo } from "@/types/types";
import { IoLocate } from "react-icons/io5";
import { useMapStore } from "@/stores/map-store";
import { ZOOM_USE_DEFAULT } from "@/lib/constants";
import { RiDraggable } from "react-icons/ri";
import Draggable from "./drag-wrapper";
import CardInfo from "./card-info";
import { ContextMenu, ContextMenuTrigger } from "@radix-ui/react-context-menu";
import CardContextMenu from "./card-context-menu";
import { FiMenu } from "react-icons/fi";
import { ContextMenuContent } from "../ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type CardVariant = "default" | "recommendation" | "list" | "hover";

const Card = forwardRef<
  HTMLDivElement,
  {
    info: ConventionInfo;
    selected?: boolean;
    onClick?: () => void;
    type?: CardVariant;
  }
>(({ info, selected = false, onClick, type = "default" }, ref) => {
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
    <ContextMenu>
      <ContextMenuTrigger
        ref={ref}
        onClick={onClick}
        className={`${baseClass} ${variantClass}`}
      >
        {type !== "list" && (
          <Draggable con={info}>
            <div
              className={`absolute flex items-center justify-center  bg-primary-light right-0 top-0 h-16 w-6`}
            >
              <RiDraggable className="size-8 text-primary-darker" />
            </div>
          </Draggable>
        )}

        <div className="flex flex-col ml-12">
          <CardInfo info={info} />
        </div>
        <div className="absolute right-8 bottom-0.5 flex flex-col gap-0.5 text-primary-muted transition-all">
          <IoLocate
            aria-label="Fly to Location"
            title="Fly to Location"
            className="hover:scale-110 hover:text-primary-text cursor-default"
            onClick={(e) => {
              // if the target button is clicked, then fly to it. but don't deselect the card itself
              e.stopPropagation();
              flyTo?.(
                { longitude: info.location_long, latitude: info.location_lat },
                ZOOM_USE_DEFAULT
              );
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <FiMenu
                aria-label="Open Card Menu"
                title="Open Card Menu"
                className="hover:scale-110 hover:text-primary-text cursor-default"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              <CardContextMenu cardType={type} con={info} menuType="dropdown" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <CardContextMenu cardType={type} con={info} menuType="context" />
      </ContextMenuContent>
    </ContextMenu>
  );
});
Card.displayName = "Card";

export default Card;
