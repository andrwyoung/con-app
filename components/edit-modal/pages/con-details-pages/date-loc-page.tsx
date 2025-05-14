import { Label } from "@/components/ui/label";
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

export default function DatesLocationPage({
  conId,
  years,
  setYears,
  long,
  setLong,
  lat,
  setLat,
}: {
  conId: number;
  years: NewYearInfoFields[];
  setYears: (y: NewYearInfoFields[]) => void;
  long: number | undefined;
  setLong: (e: number | undefined) => void;
  lat: number | undefined;
  setLat: (e: number | undefined) => void;
}) {
  const [activeYear, setActiveYear] = useState<NewYearInfoFields | null>(null);

  // adding new year helpers
  const [newYearDraft, setNewYearDraft] = useState<string | undefined>(
    undefined
  );
  const [showLongLat, setShowLongLat] = useState(false);

  // helpers
  const sorted = [...years].sort((a, b) => b.year - a.year);
  const latestYear = sorted[0];

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex gap-2">
          <Label htmlFor="year-select">Select Year:</Label>
          <Select
            value={activeYear?.year.toString() ?? "__none__"}
            onValueChange={(val) => {
              if (val === "__none__") {
                setActiveYear(null);
              } else {
                setActiveYear(
                  years.find((y) => y.year.toString() === val) ?? null
                );
              }

              setNewYearDraft(undefined);
            }}
          >
            <SelectTrigger
              id="year-select"
              className="text-primary-text bg-white border rounded-lg px-2 py-2 shadow-xs w-fit"
            >
              <SelectValue placeholder="Choose a year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>

              {activeYear && newYearDraft && (
                <SelectItem value={activeYear.year.toString()}>
                  New ({newYearDraft})
                </SelectItem>
              )}

              {years.map((y) => (
                <SelectItem key={y.year} value={y.year.toString()}>
                  {y.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                const sortedYears = years
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
                const exists = years.some((y) => y.year === updated.year);
                const updatedList = exists
                  ? years.map((y) => (y.year === updated.year ? updated : y))
                  : [...years, updated];

                setYears(updatedList);
                setActiveYear(null);
                setNewYearDraft(undefined);
              }}
              onDelete={() => {
                if (!activeYear) return;

                const updated = years.filter((y) => y.year !== activeYear.year);
                setYears(updated);
                setActiveYear(null);
                setNewYearDraft(undefined);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <button
          onClick={() => setShowLongLat((prev) => !prev)}
          className="text-sm text-primary-text cursor-pointer 
        hover:text-primary-muted transition flex items-center gap-1 mb-2 px-2 "
          type="button"
        >
          Edit Map Marker (Lat/Long):
          <FaCaretDown
            className={`size-[12px] text-primary-muted transform translate-y-[1px] transition-transform duration-200 ${
              showLongLat ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
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
              {lat && long && (
                <div className="flex flex-col gap-2">
                  <MapboxMiniMap
                    lat={lat}
                    long={long}
                    onUpdate={({ lat, long }) => {
                      setLat(lat);
                      setLong(long);
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
