import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFilterStore } from "@/stores/filter-store";
import FilterToggleButton from "./filters/filter-helpers";
import { FaCaretDown } from "react-icons/fa6";
import TagsFilter from "./filters/tag-filter";
import StatusFilter from "./filters/status-filter";
import DistanceFilter from "./filters/distance-filter";

export type FilterKey = "tags" | "time" | "distance" | "status";

function FilterPanel({ type }: { type: FilterKey }) {
  switch (type) {
    case "tags":
      return <TagsFilter />;
    case "distance":
      return <DistanceFilter />;
    case "status":
      return <StatusFilter />;
    default:
      return null;
  }
}

export default function FilterMode() {
  const [shownFilters, setShownFilters] = useState<FilterKey[]>([]);
  const filterBar: FilterKey[] = ["tags", "distance", "status"];
  const numberOfCons = Object.keys(
    useFilterStore((s) => s.filteredItems)
  ).length;

  const resetAllFilters = useFilterStore((s) => s.resetAllFilters);

  const tagFilterIsActive = useFilterStore((s) => s.tagFilterIsActive());
  const statusFilterIsActive = useFilterStore((s) => s.statusFilterIsActive());
  const activeCount = [tagFilterIsActive, statusFilterIsActive].filter(
    Boolean
  ).length;

  const [showRecomended, setShowRecomended] = useState(true);

  return (
    <div className="flex flex-col min-h-0">
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
                setShowRecomended(true);
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
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-2">
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
                toggle={() => setShownFilters(() => (isShown ? [] : [filter]))}
              />
            );
          })}
        </div>
      </div>
      <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
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
        <div className="flex flex-col items-center">
          <hr className="border-t border-primary-muted w-64 my-3" />
          <button
            type="button"
            className="flex flex-row items-center gap-1 cursor-pointer"
            onClick={() => setShowRecomended((prev) => !prev)}
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

          {showRecomended && (
            <>
              {" "}
              <p className="text-xs text-primary-muted italic">
                Based on your location and recent activity
              </p>
              <p>cards go here</p>{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
