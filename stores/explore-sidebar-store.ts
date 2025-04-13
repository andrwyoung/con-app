import { DROPDOWN_RESULTS } from "@/lib/constants";
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


type SearchHistoryItem = {
  term: string;         // what they typed or clicked
  timestamp: number;    // when it happened (for sorting, freshness)
  source?: "typed" | "clicked"; // optional: how it was added
};

type SearchStore = {
  results: EventInfo[];
  setResults: (r: EventInfo[]) => void;

  sortPreference: SortType,
  setSortPreference: (value: SortType) => void,

  history: SearchHistoryItem[];
  addToHistory: (term: string, source?: "typed" | "clicked") => void;
  clearHistory: () => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  results: [],
  setResults: (r) => set({ results: r }),

  sortPreference: "raw" as SortType,
  setSortPreference: (value: SortType) => set({ sortPreference: value }),

  history: [],
  addToHistory: (term, source = "typed") =>
    set((state) => {
      const trimmedTerm = term.trim();
      if (!trimmedTerm) return state;

      const newItem = {
        term: trimmedTerm,
        timestamp: Date.now(),
        source,
      };

      const updated = [
        newItem,
        ...state.history.filter((h) => h.term !== trimmedTerm),
      ].slice(0, DROPDOWN_RESULTS);

      return { history: updated };
    }),

  clearHistory: () => set({ history: [] }),
}));



type MapCardsStore = {
  focusedEvents: EventInfo[];
  setFocusedEvents: (e: EventInfo[]) => void;
};

export const useMapCardsStore = create<MapCardsStore>((set) => ({
  focusedEvents: [],
  setFocusedEvents: (e) => set({ focusedEvents: e }),
}));