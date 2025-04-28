// the cards themselves. representing a single convention

import React, { forwardRef, useState } from "react";
import { ConventionInfo } from "@/types/types";
import { IoLocate } from "react-icons/io5";
import { useMapStore } from "@/stores/map-store";
import { STAR_LIST, ZOOM_USE_DEFAULT } from "@/lib/constants";
import CardInfo from "./card-info";
import { ContextMenu, ContextMenuTrigger } from "@radix-ui/react-context-menu";
import CardContextMenu from "./card-context-menu";
import { FiMenu, FiStar, FiTrash2 } from "react-icons/fi";
import { ContextMenuContent } from "../ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useCurrentScope } from "@/hooks/use-current-scope";
import { toastAddedToList, toastRemovedFromList } from "@/lib/default-toasts";
import { log } from "@/lib/utils";
import { useListStore } from "@/stores/list-store";
import { useScopedSelectedCardsStore } from "@/stores/page-store";
import { EventBus } from "@/utils/event-bus";

export type CardVariant =
  | "default"
  | "recommendation"
  | "list"
  | "hover"
  | "prediction";

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

  // animations
  const [bouncing, setBouncing] = useState(false);
  const [shrinking, setShrinking] = useState(false);

  const scope = useCurrentScope();

  const setShowingNow = useListStore((s) => s.setShowingNow);
  const showingNow = useListStore((s) => s.showingNow);
  const addToList = useListStore((s) => s.addToList);
  const getListName = useListStore((s) => s.getListName);
  const removeFromList = useListStore((s) => s.removeFromList);
  const setSelectedCon = useScopedSelectedCardsStore(scope).setSelectedCon;

  const isStarred = useListStore((s) =>
    s.lists[STAR_LIST].items.some(
      (c) =>
        c.id === info.id && c.convention_year_id === info.convention_year_id
    )
  );

  const baseClass =
    "relative flex flex-row cursor-pointer border border-input items-center w-full h-18 rounded-lg px-4 py-1 overflow-hidden transition-all transform group select-none";
  const variantClass =
    type === "recommendation"
      ? selected
        ? "outline-3 outline-secondary bg-white "
        : "bg-white hover:scale-[1.01] shadow-xs outline-2 outline-primary-light"
      : type === "hover"
      ? "bg-primary-light shadow-lg"
      : type === "list"
      ? selected
        ? "outline-3 outline-primary bg-secondary-light"
        : "bg-secondary-lightest hover:scale-[1.01] shadow-xs"
      : type === "prediction"
      ? selected
        ? "outline-3 outline-primary bg-slate-200"
        : "bg-slate-100 hover:scale-[1.01] shadow-xs"
      : selected
      ? "outline-3 outline-secondary bg-primary-light"
      : "bg-primary-lightest hover:scale-[1.01] shadow-xs";

  function handleClick() {
    if (isStarred) {
      removeFromList(STAR_LIST, info);
      toastRemovedFromList(info.name, getListName(STAR_LIST));

      return;
    }

    setBouncing(true);
    setTimeout(() => setBouncing(false), 800); // match animation duration
    EventBus.emit("flashSidebarButton");

    setShowingNow(STAR_LIST);
    addToList(STAR_LIST, info);
    toastAddedToList(info.name, getListName(STAR_LIST));
    setSelectedCon(info);
    log("Added", info.name, "to list", STAR_LIST);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger
        ref={ref}
        onClick={onClick}
        className={`${baseClass} ${variantClass}`}
      >
        <div className="flex flex-col ml-14">
          <CardInfo info={info} />
        </div>
        <div className="absolute right-0 bottom-0 items-end flex text-primary-muted transition-all">
          <div className="flex flex-col mb-1 mr-2 gap-1 items-center">
            {type != "list" ? (
              <FiStar
                title="Save to List"
                aria-label="Save to List"
                className={`w-4.5 h-4.5 hover:scale-110 transition-transform  ${
                  bouncing ? "animate-bounce-scale" : ""
                } ${
                  isStarred
                    ? "fill-secondary text-secondary hover:text-secondary-darker"
                    : "hover:text-primary-text"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              />
            ) : (
              <FiTrash2
                aria-label="Remove From List"
                title="Remove From List"
                className={`h-4.5 w-4.5 hover:scale-110 transition-transform hover:text-primary-text hover:rotate-6 
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromList(showingNow, info);
                  toastRemovedFromList(info.name, getListName(showingNow));
                }}
              />
            )}

            {scope === "explore" ? (
              <IoLocate
                aria-label="Fly to Location"
                title="Fly to Location"
                className={`h-4.5 w-4.5 hover:scale-110 transition-transform hover:text-primary-text hover:rotate-6 ${
                  shrinking ? "animate-shrink-pop" : ""
                }`}
                onClick={(e) => {
                  // if the target button is clicked, then fly to it. but don't deselect the card itself
                  if (selected) e.stopPropagation();

                  flyTo?.(
                    {
                      longitude: info.location_long,
                      latitude: info.location_lat,
                    },
                    ZOOM_USE_DEFAULT
                  );

                  setShrinking(true);
                  setTimeout(() => setShrinking(false), 400);
                }}
              />
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                <FiMenu
                  aria-label="Open Card Menu"
                  title="Open Card Menu"
                  className="hover:scale-115 transition-transform hover:text-primary-text"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                <CardContextMenu
                  cardType={type}
                  con={info}
                  menuType="dropdown"
                  scope={scope}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* {type !== "list" && (
            <Draggable con={info}>
              <div className="flex items-center justify-center  bg-primary-light h-16 w-6">
                <RiDraggable className="size-8 text-primary-darker" />
              </div>
            </Draggable>
          )} */}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <CardContextMenu
          cardType={type}
          con={info}
          menuType="context"
          scope={scope}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
});
Card.displayName = "Card";

export default Card;
