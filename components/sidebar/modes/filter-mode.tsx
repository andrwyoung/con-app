import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFilterStore, useFilterUIStore } from "@/stores/filter-store";
import FilterToggleButton from "./filters/filter-helpers";
import { FaCaretDown } from "react-icons/fa6";
import TagsFilter from "./filters/tag-filter";
import StatusFilter from "./filters/status-filter";
import CardList from "../../card/card-list";
import { useMapCardsStore } from "@/stores/explore-sidebar-store";
import { useMapStore } from "@/stores/map-store";
import Recommendations from "./recomendations";

export type FilterKey = "tags" | "time" | "distance" | "status";

function FilterPanel({ type }: { type: FilterKey }) {
  switch (type) {
    case "tags":
      return <TagsFilter />;
    // case "distance":
    //   return <DistanceFilter />;
    case "status":
      return <StatusFilter />;
    default:
      return null;
  }
}

export default function FilterMode() {
  const { shownFilters, setShownFilters, showRecomended, setShowRecomended } =
    useFilterUIStore();

  const filterBar: FilterKey[] = ["tags", "status"];
  const numberOfCons = Object.keys(
    useFilterStore((s) => s.filteredItems)
  ).length;

  const filteredItems = useFilterStore((s) => s.filteredItems);

  const resetAllFilters = useFilterStore((s) => s.resetAllFilters);
  const tagFilterIsActive = useFilterStore((s) => s.tagFilterIsActive());
  const statusFilterIsActive = useFilterStore((s) => s.statusFilterIsActive());
  const activeCount = [tagFilterIsActive, statusFilterIsActive].filter(
    Boolean
  ).length;

  const {
    focusedEvents,
    filteredFocusedEvents,
    setFocusedEvents,
    setFilteredFocusedEvents,
  } = useMapCardsStore();

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
    <div className="flex flex-col min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
      <div className="flex-none py-2 px-2">
        <div className="flex flex-row justify-between items-baseline">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-primary-muted">
            Filters
          </h1>
          {activeCount > 0 && (
            <button
              className="text-xs text-rose-400 hover:underline cursor-pointer hover:text-rose-600 transition-colors"
              onClick={() => {
                resetAllFilters();
                setShownFilters([]);
              }}
            >
              Reset All Filters
            </button>
          )}
        </div>
        <p className="text-xs text-primary-muted mb-3">
          showing:
          {activeCount === 0
            ? ` all ${numberOfCons} cons • no filters applied`
            : ` ${numberOfCons} cons • ${activeCount} filter${
                activeCount === 1 ? "" : "s"
              }
               applied`}
        </p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
          {filterBar.map((filter) => {
            const isShown = shownFilters.includes(filter);

            // check if filter is active
            const isActive = (() => {
              switch (filter) {
                case "tags":
                  return tagFilterIsActive;
                // case "distance":
                //   return statusFilterIsActive;
                case "status":
                  return statusFilterIsActive;
                default:
                  return false;
              }
            })();

            return (
              <FilterToggleButton
                key={filter}
                filter={filter}
                isShown={isShown}
                isActive={isActive}
                toggle={() => setShownFilters(isShown ? [] : [filter])}
              />
            );
          })}
        </div>
      </div>
      <div className="overflow-y-auto flex-none scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {shownFilters.map((key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-y-scroll scrollbar-none"
            >
              <FilterPanel type={key} key={key} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <hr className="border-t border-primary-muted w-full mt-2 mb-2" />

      {focusedEvents.length > 0 ? (
        <>
          <div className="flex-none flex flex-row justify-between px-1 pt-2 pb-4 items-baseline">
            <h1 className="text-sm font-semibold uppercase tracking-wide text-primary-muted px-1">
              Selected (
              {filteredFocusedEvents.length > 0
                ? filteredFocusedEvents.length
                : "none"}
              )
            </h1>

            <button
              type="button"
              onClick={() => {
                setFocusedEvents([]);
                // setSelectedCon(null);
                useMapStore.getState().clearSelectedPointHighlight?.();
                useMapStore.getState().clearClickedClusterHighlight?.();
              }}
              className="bg-primary-lightest cursor-pointer text-primary-muted uppercase text-xs px-4 py-1 rounded-full hover:bg-primary-light focus:outline-none"
            >
              {filteredFocusedEvents.length > 0 ? "deselect" : "close"}
            </button>
          </div>

          {filteredFocusedEvents.length > 0 ? (
            <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
              <CardList items={filteredFocusedEvents} sortOption="status" />
            </div>
          ) : (
            <div className="text-sm text-center text-primary-muted px-2">
              No events selected. <br />
              Try removing filters
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col min-h-0 w-full py-2">
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
              {showRecomended ? <Recommendations /> : ""}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
