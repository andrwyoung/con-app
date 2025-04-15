import { EventInfo } from "@/types/types";
import { create } from "zustand";

export const topTags = ["comic", "anime", "cosplay", "gaming", "art", "manga"];
export const extraTags = [
  "show",
  "panels",
  "fandom",
  "toy",
  "books",
  "card",
  "video games",
  "tabletop",
  "fantasy",
  "workshops",
  "movies",
  "tv",
  "lego",
  "furry",
  "horror",
  "camp",
  "kpop",
  "lgbt",
  "disney",
];

export const allTags = [...topTags, ...extraTags];

type FilterStore = {
  // global list of filtered items
  filteredItems: Record<string, EventInfo>;
  setFilteredItems: (dict: Record<string, EventInfo>) => void;

  // tag filter
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectAllTags: () => void;
  clearTagFilter: () => void;
  tagFilterIsActive: () => boolean;

  includeUntagged: boolean;
  setIncludeUntagged: (e: boolean) => void;

  // reseting all filters
  resetAllFilters: () => void;
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  filteredItems: {},
  setFilteredItems: (dict) => set({ filteredItems: dict }),

  selectedTags: [...allTags],
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  selectAllTags: () => set({ selectedTags: [...allTags] }),
  clearTagFilter: () => set({ selectedTags: [] }),
  tagFilterIsActive: () => {
    const s = get();
    return s.selectedTags.length !== allTags.length && s.includeUntagged;
  },

  includeUntagged: true,
  setIncludeUntagged: (value) => set({ includeUntagged: value }),

  // reseting all filters
  resetAllFilters: () => {
    const s = get();
    s.selectAllTags();
  },
}));
