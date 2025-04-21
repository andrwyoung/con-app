import { ConventionInfo } from "@/types/types";
import { create, StateCreator } from "zustand";

export type SidebarMode = "search" | "filter" | "map";

export function useScopedSelectedCardsStore(scope: "explore" | "plan") {
  return scope === "explore"
    ? useExploreSelectedCardsStore()
    : usePlanSelectedCardsStore();
}

type SelectedCardsStore = {
  selectedCon: ConventionInfo | null;
  setSelectedCon: (id: ConventionInfo | null) => void;

  selectedIndex: number;
  setSelectedIndex: (index: number) => void;

  focusedEvents: ConventionInfo[];
  setFocusedEvents: (e: ConventionInfo[]) => void;

  filteredFocusedEvents: ConventionInfo[];
  setFilteredFocusedEvents: (e: ConventionInfo[]) => void;

  clearSelectedEvents: () => void;
};

function createSelectedCardsStoreInitializer(): StateCreator<SelectedCardsStore> {
  return (set) => ({
    selectedCon: null,
    setSelectedCon: (con) => set({ selectedCon: con }),

    selectedIndex: -1,
    setSelectedIndex: (index) => set({ selectedIndex: index }),

    focusedEvents: [],
    setFocusedEvents: (e) => set({ focusedEvents: e }),

    filteredFocusedEvents: [],
    setFilteredFocusedEvents: (e) => set({ filteredFocusedEvents: e }),

    clearSelectedEvents: () =>
      set({
        focusedEvents: [],
        filteredFocusedEvents: [],
        selectedIndex: -1,
        selectedCon: null,
      }),
  });
}

export const useExploreSelectedCardsStore = create<SelectedCardsStore>(
  createSelectedCardsStoreInitializer()
);

export const usePlanSelectedCardsStore = create<SelectedCardsStore>(
  createSelectedCardsStoreInitializer()
);

type SidebarStore = {
  initialized: boolean;
  setInitialized: () => void;

  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;

  selectedClusterId: number | null;
  setSelectedClusterId: (id: number | null) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  initialized: false,
  setInitialized: () => set({ initialized: true }),

  sidebarMode: "filter",
  setSidebarMode: (mode) => set({ sidebarMode: mode }),

  selectedClusterId: null,
  setSelectedClusterId: (id) => set({ selectedClusterId: id }),
}));
