import { SortType } from "@/lib/sort-cons";
import { EventInfo } from "@/types/types";
import { create } from "zustand";


export type SidebarMode = "search" | "filter" | "map";

type SidebarStore = {
  sidebarMode: SidebarMode;
  setSidebarModeAndDeselectCon: (mode: SidebarMode) => void;

  selectedCon: EventInfo | null;
  setSelectedCon: (id: EventInfo | null) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarMode: "filter",
  setSidebarModeAndDeselectCon: (mode) => set({ sidebarMode: mode, selectedCon: null  }),

  selectedCon: null,
  setSelectedCon: (id) => {set({ selectedCon: id })},
}));


type SearchStore = {
  results: EventInfo[];
  setResults: (r: EventInfo[]) => void;

  sortPreference: SortType,
  setSortPreference: (value: SortType) => void,
};

export const useSearchStore = create<SearchStore>((set) => ({
  results: [],
  setResults: (r) => set({ results: r }),

  sortPreference: "raw" as SortType,
  setSortPreference: (value: SortType) => set({ sortPreference: value }),
}));



type MapCardsStore = {
  focusedEvents: EventInfo[];
  setFocusedEvents: (e: EventInfo[]) => void;
};

export const useMapCardsStore = create<MapCardsStore>((set) => ({
  focusedEvents: [],
  setFocusedEvents: (e) => set({ focusedEvents: e }),
}));