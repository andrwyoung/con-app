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
import YearEdit from "./con-details-helpers/year-edit";
import { FaCaretDown } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import MapboxMiniMap from "./con-details-helpers/mini-mapbox";

export default function DatesLocationPage({
  years,
  setYears,
  long,
  setLong,
  lat,
  setLat,
}: {
  years: NewYearInfoFields[];
  setYears: (y: NewYearInfoFields[]) => void;
  long: number | undefined;
  setLong: (e: number | undefined) => void;
  lat: number | undefined;
  setLat: (e: number | undefined) => void;
}) {
  const [activeYear, setActiveYear] = useState<NewYearInfoFields | null>(null);

  // adding new year helpers
  // const [isAddingYear, setIsAddingYear] = useState(false);
  // const [newYearDraft, setNewYearDraft] = useState<NewYearInfoFields | null>(
  //   null
  // );
  const [showLongLat, setShowLongLat] = useState(false);

  // helpers
  // const nextYear = Math.max(...years.map((y) => y.year)) + 1;

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
              {years.map((y) => (
                <SelectItem key={y.year} value={y.year.toString()}>
                  {y.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          // onClick={() => setIsAddingYear(true)}
          className="text-sm px-2 py-1 bg-primary hover:bg-primary-light border-2 border-primary 
          cursor-pointer transition-all rounded-lg text-primary-text"
        >
          + Add Year
        </button>
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
              yearData={activeYear}
              onChange={(updated) => {
                const updatedList = years.map((y) =>
                  y.year === updated.year ? updated : y
                );
                setYears(updatedList);
                setActiveYear(updated);
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
