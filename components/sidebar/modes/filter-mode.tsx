import React, { useState } from "react";
import {
  DistanceFilter,
  StatusFilter,
  TagsFilter,
  TimeFilter,
} from "./filters/filters";
import { FaPlus } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

export type FilterKey = "tags" | "time" | "distance" | "status";

export default function FilterMode() {
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>(["tags"]);
  const allFilters: FilterKey[] = ["tags", "distance", "status"];

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

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex-none">
        <h1 className="text-sm font-semibold uppercase tracking-wide text-primary-muted mb-2 ">
          Filters
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-2">
          {allFilters.map((filter) => {
            const isActive = activeFilters.includes(filter);

            return (
              <button
                key={filter}
                aria-pressed={isActive}
                onClick={() => {
                  setActiveFilters(
                    (prev) =>
                      isActive
                        ? prev.filter((f) => f !== filter) // deactivate
                        : [...prev, filter] // activate
                  );
                }}
                className={`flex items-center gap-1 text-xs px-2 py-0.5 cursor-pointer rounded-md border text-primary-text transition-color ${
                  isActive
                    ? "bg-primary border-primary"
                    : "bg-white hover:bg-primary-lightest  border-gray-300 hover:border-primary"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                <FaPlus
                  className={`size-[10px] transform translate-y-[1px] transition-transform duration-200 ${
                    isActive ? "rotate-45" : "rotate-0"
                  }`}
                />
              </button>
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
              <FilterPanel type={key} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
