import { DROPDOWN_RESULTS } from "@/lib/constants";
import { SortType } from "@/lib/helpers/sort-cons";
import { ConventionInfo } from "@/types/types";
import { create } from "zustand";


export type SidebarMode = "search" | "filter" | "map";

type SidebarStore = {
  initialized: boolean;
  setInitialized: () => void;

  sidebarMode: SidebarMode;
  setSidebarModeAndDeselectCon: (mode: SidebarMode) => void;

  selectedCon: ConventionInfo | null;
  setSelectedCon: (id: ConventionInfo | null) => void;

  selectedClusterId: number | null;
  setSelectedClusterId: (id: number | null) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  initialized: false,
  setInitialized: () => set({initialized: true}),

  sidebarMode: "filter",
  setSidebarModeAndDeselectCon: (mode) => set({ sidebarMode: mode}),

  selectedCon: null,
  setSelectedCon: (id) => {set({ selectedCon: id })},

  selectedClusterId: null,
  setSelectedClusterId: (id) => set({selectedClusterId: id}),
}));


type SearchHistoryItem = {
  term: string;         
  timestamp: number; 
  source?: "typed" | "clicked"; 
};

type SearchStore = {
  results: ConventionInfo[];
  setResults: (r: ConventionInfo[]) => void;

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
  focusedEvents: ConventionInfo[];
  setFocusedEvents: (e: ConventionInfo[]) => void;

  filteredFocusedEvents: ConventionInfo[]; 
  setFilteredFocusedEvents: (e: ConventionInfo[]) => void;

  clearSelectedEvents: () => void;
};

export const useMapCardsStore = create<MapCardsStore>((set) => ({
  focusedEvents: [],
  setFocusedEvents: (e) => set({ focusedEvents: e }),

  filteredFocusedEvents: [],
  setFilteredFocusedEvents: (e) => set({ filteredFocusedEvents: e }),

  clearSelectedEvents: () => set({focusedEvents: [], filteredFocusedEvents: []}),
}));