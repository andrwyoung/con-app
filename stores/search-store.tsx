import { DROPDOWN_RESULTS } from "@/lib/constants";
import { SearchContext, SearchState } from "@/types/search-types";
import { ConventionInfo, Scope } from "@/types/types";
import { create, StateCreator } from "zustand";

export function useScopedSearchStore(scope: Scope): SearchStore {
  return scope === "explore" ? useExploreSearchStore() : usePlanSearchStore();
}

type SearchStore = {
  results: ConventionInfo[];
  setResults: (r: ConventionInfo[]) => void;

  searchState: SearchState;
  setSearchState: (ctx: SearchContext | null) => void;
};

function createSearchStoreInitializer(): StateCreator<SearchStore> {
  return (set) => ({
    results: [],
    setResults: (r) => set({ results: r }),

    searchState: {
      context: null,
    },
    setSearchState: (ctx) => set({ searchState: { context: ctx } }),
  });
}

export const useExploreSearchStore = create<SearchStore>(
  createSearchStoreInitializer()
);
export const usePlanSearchStore = create<SearchStore>(
  createSearchStoreInitializer()
);

// History Items (shared between all seachbars)

type SearchHistoryItem = {
  term: string;
  timestamp: number;
  source?: "typed" | "clicked";
};

type SearchHistoryStore = {
  history: SearchHistoryItem[];
  addToHistory: (term: string, source?: "typed" | "clicked") => void;
  clearHistory: () => void;
};

export const useSearchHistoryStore = create<SearchHistoryStore>((set) => ({
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
