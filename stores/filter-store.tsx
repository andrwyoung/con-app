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
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectAllFilters: () => void;
  clearAllFilters: () => void;

  includeUntagged: boolean;
  setIncludeUntagged: (e: boolean) => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  selectedTags: [...allTags],
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  selectAllFilters: () => set({ selectedTags: [...allTags] }),
  clearAllFilters: () => set({ selectedTags: [] }),

  includeUntagged: true,
  setIncludeUntagged: (value) => set({ includeUntagged: value }),
}));

// DEPRECATED: dynamically generating tags from all events
export function extractExtraTags(
  events: EventInfo[],
  topTags: string[]
): string[] {
  const tagCount: Record<string, number> = {};

  for (const event of events) {
    for (const tag of event.tags.map((t) => t.trim().toLowerCase())) {
      if (!topTags.includes(tag)) {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      }
    }
  }

  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1]) // sort by frequency
    .map(([tag]) => tag)
    .filter((tag) => !topTags.includes(tag)); // take out the top tags
}
