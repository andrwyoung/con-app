import { EventInfo } from "@/types/types";
import { create } from "zustand";

type SearchStore = {
  results: EventInfo[];
  setResults: (r: EventInfo[]) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  results: [],
  isLoading: false,
  setResults: (r) => set({ results: r}),
}));



export type SidebarMode = "search" | "filter" | "map";

type SidebarStore = {
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarMode: "filter",
  setSidebarMode: (mode) => set({ sidebarMode: mode }),
}));