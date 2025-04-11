import { EventInfo } from "@/types/types";
import { create } from "zustand";


export type SidebarMode = "search" | "filter" | "map";

type SidebarStore = {
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;

  selectedCon: EventInfo | null;
  setSelectedCon: (id: EventInfo | null) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarMode: "filter",
  setSidebarMode: (mode) => set({ sidebarMode: mode, selectedCon: null  }),

  selectedCon: null,
  setSelectedCon: (id) => set({ selectedCon: id }),
}));




type SearchStore = {
  results: EventInfo[];
  setResults: (r: EventInfo[]) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  results: [],
  setResults: (r) => set({ results: r }),
}));



type MapCardsStore = {
  focusedEvents: EventInfo[];
  setFocusedEvents: (e: EventInfo[]) => void;
};

export const useMapCardsStore = create<MapCardsStore>((set) => ({
  focusedEvents: [],
  setFocusedEvents: (e) => set({ focusedEvents: e }),
}));