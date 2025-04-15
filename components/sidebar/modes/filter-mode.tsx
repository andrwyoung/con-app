import { useState } from "react";
import {
  DistanceFilter,
  StatusFilter,
  TagsFilter,
  TimeFilter,
} from "./filters/filters";
import { AnimatePresence, motion } from "framer-motion";
import { useFilterStore } from "@/stores/filter-store";
import FilterToggleButton from "./filters/helpers";

export type FilterKey = "tags" | "time" | "distance" | "status";

function FilterPanel({ type }: { type: FilterKey }) {
  switch (type) {
    case "tags":
      return <TagsFilter />;
    case "time":
      return <TimeFilter />;
    case "distance":
      return <DistanceFilter />;
    case "status":
      return <StatusFilter />;
    default:
      return null;
  }
}

export default function FilterMode() {
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([]);
  const filterBar: FilterKey[] = ["tags", "distance", "status"];
  const numberOfCons = Object.keys(
    useFilterStore((s) => s.filteredItems)
  ).length;

  const resetAllFilters = useFilterStore((s) => s.resetAllFilters);
  const tagFilterIsActive = useFilterStore((s) => s.tagFilterIsActive());
  const activeCount = [tagFilterIsActive].filter(Boolean).length;

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
                setActiveFilters([]);
              }}
            >
              reset all filters
            </button>
          )}
        </div>
        <p className="text-xs text-primary-muted mb-3">
          showing: {numberOfCons} cons • {activeCount} active filters
        </p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-2">
          {filterBar.map((filter) => {
            const isActive = activeFilters.includes(filter);

            // check if filter is active
            const hasActiveFilters = (() => {
              switch (filter) {
                case "tags":
                  return tagFilterIsActive;
                // case "distance":
                //   return store.distance !== store.defaultDistance;
                // case "status":
                //   return store.status !== "all"; // or whatever your default is
                default:
                  return false;
              }
            })();

            return (
              <FilterToggleButton
                key={filter}
                filter={filter}
                isActive={isActive}
                hasActiveFilters={hasActiveFilters}
                toggle={() =>
                  setActiveFilters((prev) =>
                    isActive
                      ? prev.filter((f) => f !== filter)
                      : [...prev, filter]
                  )
                }
              />
            );
          })}
        </div>
      </div>
      <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {activeFilters.map((key) => (
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
    </div>
  );
}
