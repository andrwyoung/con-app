import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useFilterStore } from "@/stores/filter-store";
import { FaCaretDown } from "react-icons/fa6";
import CardList from "../../card/card-list/card-list";
import { useMapPinsStore, useMapStore } from "@/stores/map-store";
import Recommendations from "./recomendations";
import {
  useExploreSelectedCardsStore,
  useScopedSelectedCardsStore,
} from "@/stores/page-store";
import { Scope } from "@/types/con-types";
import { useExploreUIStore } from "@/stores/ui-store";
import FilterSection from "./filter-section";

export default function FilterMode({ scope }: { scope: Scope }) {
  const { showRecomended, setShowRecomended } = useExploreUIStore();

  const filteredItems = useFilterStore((s) => s.filteredItems);
  const setSelectedCon = useExploreSelectedCardsStore((s) => s.setSelectedCon);
  const selectedCon = useExploreSelectedCardsStore((s) => s.selectedCon);

  const {
    focusedEvents,
    filteredFocusedEvents,
    setFocusedEvents,
    setFilteredFocusedEvents,
  } = useScopedSelectedCardsStore(scope);

  // whenever filters change, update the selected items list
  // but still keep the original full list around
  useEffect(() => {
    const filteredKeys = Object.keys(filteredItems);
    const updatedFilteredEvents = focusedEvents.filter((event) =>
      filteredKeys.includes(event.id.toString())
    );
    setFilteredFocusedEvents(updatedFilteredEvents);
  }, [filteredItems, focusedEvents, setFilteredFocusedEvents]);

  return (
    <div className="flex flex-col min-h-0 max-h-[calc(100dvh-18rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
      <div
        className={
          filteredFocusedEvents.length > 0 ? "hidden md:block" : "block"
        }
      >
        <FilterSection scope={scope} />
      </div>

      <hr className="hidden md:block border-t border-primary-muted w-full mt-2 mb-2" />

      {focusedEvents.length > 0 ? (
        <>
          <div className="flex-none flex flex-row justify-between px-1 pt-2 pb-4 items-baseline">
            {/* Mobile-only version */}
            <h1 className="block md:hidden text-sm font-semibold uppercase tracking-wide text-primary-muted px-1">
              {selectedCon
                ? "Convention Details"
                : filteredFocusedEvents.length > 0
                ? `${filteredFocusedEvents.length} ${
                    filteredFocusedEvents.length === 1 ? "Con" : "Cons"
                  } Selected`
                : "None Selected"}
            </h1>

            {/* Desktop-only version */}
            <h1 className="hidden md:block text-sm font-semibold uppercase tracking-wide text-primary-muted px-1">
              {filteredFocusedEvents.length > 0
                ? `${filteredFocusedEvents.length} ${
                    filteredFocusedEvents.length === 1 ? "Con" : "Cons"
                  } Selected`
                : "None Selected"}
            </h1>

            <button
              type="button"
              onClick={() => {
                setFocusedEvents([]);
                setSelectedCon(null);
                useMapStore.getState().clearSelectedPointHighlight?.();
                useMapStore.getState().clearClickedClusterHighlight?.();
                useMapPinsStore.getState().clearTempPins();
              }}
              className="bg-primary-lightest cursor-pointer text-primary-muted uppercase text-xs px-4 py-1 rounded-full hover:bg-primary-light focus:outline-none"
            >
              {filteredFocusedEvents.length > 0 ? "deselect" : "close"}
            </button>
          </div>

          {filteredFocusedEvents.length > 0 ? (
            <div className="hidden md:block overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
              <CardList
                items={filteredFocusedEvents}
                sortOption="status"
                scope={scope}
              />
            </div>
          ) : (
            <div className="hidden md:block text-sm text-center text-primary-muted px-2">
              No events selected. <br />
              Try removing filters
            </div>
          )}
        </>
      ) : (
        <div className="hidden md:flex flex-col min-h-0 w-full py-2">
          <button
            type="button"
            className="flex flex-row items-center gap-1 cursor-pointer"
            onClick={() => setShowRecomended(!showRecomended)}
          >
            <h1 className="font-semibold uppercase text-primary-muted text-sm tracking-wide">
              Recomended
            </h1>
            <FaCaretDown
              className={`size-[12px] text-primary-muted transform translate-y-[1px] transition-transform duration-200 ${
                showRecomended ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div className="overflow-y-auto w-full flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {showRecomended ? <Recommendations scope={scope} /> : ""}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
