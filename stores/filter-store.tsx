import { FilterKey } from "@/components/sidebar-panel/modes/filter-mode";
import { timeCategories } from "@/lib/helpers/event-recency";
import { ConventionInfo } from "@/types/types";
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
  filteredItems: Record<string, ConventionInfo>;
  setFilteredItems: (dict: Record<string, ConventionInfo>) => void;

  // tag filter
  tagFilter: {
    selected: string[];
    includeUntagged: boolean;
  };
  setTagFilter: (selected: string[], includeUntagged: boolean) => void;
  clearTagFilter: () => void;
  selectAllTags: () => void;
  tagFilterIsActive: () => boolean;

  // status filter
  selectedStatuses: string[];
  setSelectedStatuses: (tags: string[]) => void;
  selectAllStatuses: () => void;
  clearStatusFilter: () => void;
  statusFilterIsActive: () => boolean;

  // reseting all filters
  resetAllFilters: () => void;
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  filteredItems: {},
  setFilteredItems: (dict) => set({ filteredItems: dict }),

  tagFilter: {
    selected: [...allTags],
    includeUntagged: true,
  },
  setTagFilter: (selected, includeUntagged) =>
    set({ tagFilter: { selected, includeUntagged } }),
  clearTagFilter: () =>
    set(() => ({
      tagFilter: {
        selected: [],
        includeUntagged: false,
      },
    })),
  selectAllTags: () =>
    set(() => ({
      tagFilter: {
        selected: [...allTags],
        includeUntagged: true,
      },
    })),
  tagFilterIsActive: () => {
    const s = get();
    return (
      s.tagFilter.selected.length !== allTags.length ||
      !s.tagFilter.includeUntagged
    );
  },

  // status filter
  selectedStatuses: [...timeCategories],
  setSelectedStatuses: (tags) => set({ selectedStatuses: tags }),
  selectAllStatuses: () => set({ selectedStatuses: [...timeCategories] }),
  clearStatusFilter: () => set({ selectedStatuses: [] }),
  statusFilterIsActive: () => {
    return get().selectedStatuses.length !== timeCategories.length;
  },

  // reseting all filters
  resetAllFilters: () => {
    const s = get();
    s.selectAllTags();
    s.selectAllStatuses();
  },
}));

type FilterUIStore = {
  shownFilters: FilterKey[];
  setShownFilters: (key: FilterKey[]) => void;

  showRecomended: boolean;
  setShowRecomended: (r: boolean) => void;
};

export const useFilterUIStore = create<FilterUIStore>((set) => ({
  shownFilters: [],
  setShownFilters: (key) => set({ shownFilters: key }),

  showRecomended: true,
  setShowRecomended: (r) => set({ showRecomended: r }),
}));
