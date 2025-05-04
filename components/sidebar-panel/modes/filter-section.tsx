import { useFilterStore } from "@/stores/filter-store";
import { useScopedUIStore } from "@/stores/ui-store";
import React from "react";
import FilterToggleButton from "./filters/filter-helpers";
import { AnimatePresence, motion } from "framer-motion";
import TagsFilter from "./filters/tag-filter";
import StatusFilter from "./filters/status-filter";
import { Scope } from "@/types/con-types";
import ArtistAlleyFilter from "./filters/artist-alley-filter";

export type FilterKey = "tags" | "time" | "distance" | "status" | "apps";

function FilterPanel({ type }: { type: FilterKey }) {
  switch (type) {
    case "tags":
      return <TagsFilter />;
    case "apps":
      return <ArtistAlleyFilter />;
    case "status":
      return <StatusFilter />;
    default:
      return null;
  }
}

export default function FilterSection({ scope }: { scope: Scope }) {
  const { shownFilters, setShownFilters } = useScopedUIStore(scope);

  const filterBar: FilterKey[] = ["tags", "status", "apps"];
  const numberOfCons = Object.keys(
    useFilterStore((s) => s.filteredItems)
  ).length;

  const resetAllFilters = useFilterStore((s) => s.resetAllFilters);
  const tagFilterIsActive = useFilterStore((s) => s.tagFilterIsActive());
  const statusFilterIsActive = useFilterStore((s) => s.statusFilterIsActive());
  const aaStatusFilterIsActive = useFilterStore((s) =>
    s.aaStatusFilterIsActive()
  );
  const activeCount = [
    tagFilterIsActive,
    statusFilterIsActive,
    aaStatusFilterIsActive,
  ].filter(Boolean).length;

  return (
    <>
      <div className="flex-none py-0.5 md:py-2 px-2">
        <div className="hidden md:flex flex-row justify-between items-baseline">
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
    </>
  );
}
