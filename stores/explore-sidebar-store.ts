import { DEFAULT_SORT, DROPDOWN_RESULTS } from "@/lib/constants";
import { SearchContext, SearchState, SortType } from "@/types/search-types";
import { ConventionInfo } from "@/types/types";
import { create } from "zustand";


export type SidebarMode = "search" | "filter" | "map";

type SidebarStore = {
  initialized: boolean;
  setInitialized: () => void;

  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;

  selectedCon: ConventionInfo | null;
  setSelectedCon: (id: ConventionInfo | null) => void;

  selectedClusterId: number | null;
  setSelectedClusterId: (id: number | null) => void;

  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  initialized: false,
  setInitialized: () => set({initialized: true}),

  sidebarMode: "filter",
  setSidebarMode: (mode) => set({ sidebarMode: mode}),

  selectedCon: null,
  setSelectedCon: (id) => {set({ selectedCon: id })},

  selectedClusterId: null,
  setSelectedClusterId: (id) => set({selectedClusterId: id}),

  selectedIndex: -1,
  setSelectedIndex: (index) => set({selectedIndex: index}), 
}));


type SearchHistoryItem = {
  term: string;         
  timestamp: number; 
  source?: "typed" | "clicked"; 
};

type SearchStore = {
  results: ConventionInfo[];
  setResults: (r: ConventionInfo[]) => void;
  
  searchState: SearchState;
  setSearchState: (ctx: SearchContext | null) => void;

  history: SearchHistoryItem[];
  addToHistory: (term: string, source?: "typed" | "clicked") => void;
  clearHistory: () => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  results: [],
  setResults: (r) => set({ results: r }),

  searchState: {
    context: null,
  },
  setSearchState: (ctx) => set({ searchState: { context: ctx } }),

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