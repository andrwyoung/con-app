// a ui wrapper mainly responsible for showing the titles for search-mode and map-mode
// as well as finding out what sort mode the user wants
// also provides some logic for reseting back to filter-mode
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SORT_OPTIONS, getSortLabel } from "@/lib/helpers/sort-options";
import { useScopedSearchStore } from "@/stores/search-store";
import { SortType } from "@/types/search-types";
import { Scope } from "@/types/types";
import React from "react";

export default function SearchBarWrapper({
  title,
  numResults,
  sortMode,
  setSortMode,
  children,
  scope,
}: {
  title: string;
  numResults?: number;
  sortMode: SortType;
  setSortMode: (e: SortType) => void;
  children: React.ReactNode;
  scope: Scope;
}) {
  const { setSearchState } = useScopedSearchStore(scope);

  return (
    <>
      <div className="flex flex-col py-2">
        <div className="flex-none flex flex-row justify-between px-1 items-baseline">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-primary-muted px-1">
            {title} ({numResults ?? "?"})
          </h1>
          <button
            type="button"
            onClick={() => setSearchState(null)}
            className="bg-primary-lightest cursor-pointer text-primary-muted uppercase text-xs px-4 py-1 rounded-full hover:bg-primary-light focus:outline-none"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-row px-2 items-center gap-2">
          <p className="text-xs text-primary-text">Sorting by:</p>
          <Select
            onValueChange={(value) => setSortMode(value as SortType)}
            value={sortMode}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue>{getSortLabel(sortMode)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {children}
    </>
  );
}
