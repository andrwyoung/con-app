import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewYearInfoFields } from "@/types/suggestion-types";
import React, { useState } from "react";
import YearEdit from "./con-details-helpers/page-3/year-edit";
import { FaCaretDown } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import MapboxMiniMap from "./con-details-helpers/page-3/mini-mapbox";
import { PageThreeFormState } from "@/types/editor-types";
import { FormState } from "@/lib/editing/reducer-helper";
import { FaUndo } from "react-icons/fa";

export default function DatesLocationPage({
  conId,
  state,
  setField,
  resetField,
  hasChanged,
}: {
  conId: number;
  state: FormState<PageThreeFormState>;
  setField: <K extends keyof PageThreeFormState>(
    field: K
  ) => (value: PageThreeFormState[K]) => void;
  resetField: (field: keyof PageThreeFormState) => void;
  hasChanged: (field: keyof PageThreeFormState) => boolean;
}) {
  const [activeYear, setActiveYear] = useState<NewYearInfoFields | null>(null);

  // adding new year helpers
  const [newYearDraft, setNewYearDraft] = useState<string | undefined>(
    undefined
  );
  const [showLongLat, setShowLongLat] = useState(false);

  // helpers
  const sorted = [...state.current.years].sort((a, b) => b.year - a.year);
  const latestYear = sorted[0];

  function hasYearChanged(year: number | undefined): boolean {
    if (!year) return false;

    const current = state.current.years.find((y) => y.year === year);
    const original = state.original.years.find((y) => y.year === year);
    if (!current || !original) return true;

    return (
      current.start_date !== original.start_date ||
      current.end_date !== original.end_date ||
      current.venue !== original.venue ||
      current.location !== original.location ||
      current.event_status !== original.event_status
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-semibold ${
              hasChanged("years")
                ? "text-secondary-darker"
                : "text-primary-text"
            }`}
          >
            Select Year:
          </p>
          <Select
            value={activeYear?.year.toString() ?? "__none__"}
            onValueChange={(val) => {
              if (val === "__none__") {
                setActiveYear(null);
              } else {
                setActiveYear(
                  state.current.years.find((y) => y.year.toString() === val) ??
                    null
                );
              }

              setNewYearDraft(undefined);
            }}
          >
            <SelectTrigger
              id="year-select"
              className={`bg-white border rounded-lg px-2 py-2 shadow-xs w-fit
                ${
                  hasYearChanged(activeYear?.year)
                    ? "text-secondary-darker"
                    : "text-primary-text"
                }`}
            >
              <SelectValue placeholder="Choose a year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>

              {activeYear && newYearDraft && (
                <SelectItem
                  value={activeYear.year.toString()}
                  className="font-bold text-secondary-darker"
                >
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full translate-y-[1px]"></div>
                  New ({newYearDraft})
                </SelectItem>
              )}

              {state.current.years.map((y) => (
                <SelectItem
                  key={y.year}
                  value={y.year.toString()}
                  className={`flex flex-row items-baseline ${
                    hasYearChanged(y.year)
                      ? "font-bold text-secondary-darker hover:text-secondary-darker"
                      : ""
                  }
                  `}
                >
                  {hasYearChanged(y.year) && (
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full translate-y-[1px]"></div>
                  )}
                  {y.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasChanged("years") ? (
            <div
              className="flex flex-row gap-1 items-center cursor-pointer transition-all
            text-sm text-secondary-darker hover:text-secondary"
              onClick={() => {
                resetField("years");
              }}
            >
              <FaUndo
                className="text-xs translate-y-[1px]"
                title="Revert All Years"
              />
              {/* Location */}
            </div>
          ) : null}
        </div>

        {!newYearDraft && (
          <Select
            key={newYearDraft ?? "blank"}
            value={newYearDraft}
            onValueChange={(val) => {
              const newYear = parseInt(val, 10);
              const blankYear: NewYearInfoFields = {
                year: newYear,
                is_new_year: true,
                event_status: "EventScheduled",

                // pre-fill venue/location from most recent year if available
                venue: latestYear?.venue ?? undefined,
                location: latestYear?.location ?? undefined,
                start_date: undefined,
                end_date: undefined,
              };
              setActiveYear(blankYear);

              setNewYearDraft(val);
            }}
          >
            <SelectTrigger
              className="text-sm px-2 py-1 bg-primary hover:bg-primary-light border-2 border-primary 
    cursor-pointer transition-all rounded-lg text-primary-text w-fit"
            >
              <SelectValue placeholder="+ Add Year" />
            </SelectTrigger>
            <SelectContent>
              {(() => {
                const sortedYears = state.current.years
                  .map((y) => y.year)
                  .sort((a, b) => a - b);
                const options = new Set<number>();

                if (sortedYears.length) {
                  options.add(sortedYears[0] - 1);
                  options.add(sortedYears[sortedYears.length - 1] + 1);

                  for (let i = 1; i < sortedYears.length; i++) {
                    const prev = sortedYears[i - 1];
                    const curr = sortedYears[i];
                    if (curr - prev > 1) {
                      for (let y = prev + 1; y < curr; y++) {
                        options.add(y);
                      }
                    }
                  }
                } else {
                  options.add(new Date().getFullYear());
                }

                return Array.from(options)
                  .sort((a, b) => a - b)
                  .map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ));
              })()}
            </SelectContent>
          </Select>
        )}
      </div>

      <AnimatePresence initial={false}>
        {activeYear && (
          <motion.div
            key={activeYear.year}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <YearEdit
              conId={conId}
              yearData={activeYear}
              onChange={(updated) => {
                // if it already exists, update it. if it doesn't then create one
                const exists = state.current.years.some(
                  (y) => y.year === updated.year
                );
                const updatedList = exists
                  ? state.current.years.map((y) =>
                      y.year === updated.year ? updated : y
                    )
                  : [...state.current.years, updated];

                setField("years")(updatedList);
                setActiveYear(null);
                setNewYearDraft(undefined);
              }}
              onDelete={() => {
                if (!activeYear) return;

                const updated = state.current.years.filter(
                  (y) => y.year !== activeYear.year
                );
                setField("years")(updated);
                setActiveYear(null);
                setNewYearDraft(undefined);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <div className="flex flex-row justify-between items-center mb-2">
          <button
            onClick={() => setShowLongLat((prev) => !prev)}
            className={`text-sm  cursor-pointer font-semibold 
         transition flex items-center gap-1 px-2 
        ${
          hasChanged("location")
            ? "text-secondary-darker hover:text-secondary"
            : "text-primary-text hover:text-primary-muted"
        } `}
            type="button"
          >
            Edit Map Marker (Lat/Long):
            <FaCaretDown
              className={`size-[12px] text-primary-muted transform translate-y-[1px] transition-transform duration-200 ${
                showLongLat ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {hasChanged("location") ? (
            <div
              className="flex flex-row gap-1 items-center cursor-pointer transition-all
            text-sm text-secondary-darker hover:text-secondary"
              onClick={() => {
                resetField("location");
              }}
            >
              <FaUndo
                className="text-xs translate-y-[1px]"
                title="Revert Location"
              />
              {/* Location */}
            </div>
          ) : null}
        </div>
        <AnimatePresence initial={false}>
          {showLongLat && (
            <motion.div
              key="details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {state.current.location.lat && state.current.location.long && (
                <div className="flex flex-col gap-2">
                  <MapboxMiniMap
                    lat={state.current.location.lat}
                    long={state.current.location.long}
                    onUpdate={({ lat, long }) => {
                      setField("location")({ lat, long });
                    }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
