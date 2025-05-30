// all things related to that specific page's logic (the ui stuff is in ui-store)
// from selecting conventions to which mode the sidebar is in

// we have useScopedSelectedCardsStore because some of the things explore and plan need are similar
// but most are different

import { findWeekendBucket } from "@/lib/calendar/determine-weekend";
import {
  MonthWithWeekends,
  WeekendBucket,
} from "@/lib/calendar/generate-weekends";
import { log } from "@/lib/utils";
import { ConventionInfo, Scope } from "@/types/con-types";
import { create, StateCreator } from "zustand";

export type ExploreSidebarMode = "search" | "filter" | "map";
export type PlanSidebarMode = "search" | "calendar";

// SECTION: scoped stores
//
//

export function useScopedSelectedCardsStore(scope: Scope) {
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
    setSelectedCon: (con) => {
      set({ selectedCon: con });
      log("ConventionInfo: ", con);
    },

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

// SECTION: individiual stores
//
//
// explore store

type ExploreSidebarStore = {
  sidebarMode: ExploreSidebarMode;
  setSidebarMode: (mode: ExploreSidebarMode) => void;

  selectedClusterId: number | null;
  setSelectedClusterId: (id: number | null) => void;
};

export const useExploreSidebarStore = create<ExploreSidebarStore>((set) => ({
  sidebarMode: "filter",
  setSidebarMode: (mode) => set({ sidebarMode: mode }),

  selectedClusterId: null,
  setSelectedClusterId: (id) => set({ selectedClusterId: id }),
}));

// plan store

type PlanSidebarStore = {
  sidebarMode: PlanSidebarMode;
  setSidebarMode: (mode: PlanSidebarMode) => void;

  selectedMonth: MonthWithWeekends | null;
  setSelectedMonth: (id: MonthWithWeekends | null) => void;

  selectedWeekend: WeekendBucket | null;
  setSelectedWeekend: (id: WeekendBucket | null) => void;

  selectedCalendarCons: ConventionInfo[];
  setSelectedCalendarCons: (cons: ConventionInfo[]) => void;
  selectedCalendarPredictions: ConventionInfo[];
  setSelectedCalendarPredictions: (cons: ConventionInfo[]) => void;

  clearCalendarSelection: () => void;
};

export const usePlanSidebarStore = create<PlanSidebarStore>((set) => ({
  sidebarMode: "calendar",
  setSidebarMode: (mode) => set({ sidebarMode: mode }),

  selectedMonth: null,
  setSelectedMonth: (month) =>
    set(() => ({
      selectedMonth: month,
      selectedWeekend: null,
    })),

  selectedWeekend: (() => {
    const today = new Date();
    return findWeekendBucket(today.toISOString().split("T")[0]);
  })(),
  setSelectedWeekend: (weekend) =>
    set(() => ({
      selectedWeekend: weekend,
      selectedMonth: null,
    })),

  selectedCalendarCons: [],
  setSelectedCalendarCons: (cons) => set({ selectedCalendarCons: cons }),

  selectedCalendarPredictions: [],
  setSelectedCalendarPredictions: (cons) =>
    set({ selectedCalendarPredictions: cons }),

  clearCalendarSelection: () =>
    set(() => ({
      selectedMonth: null,
      selectedWeekend: null,
      selectedCalendarCons: [],
      selectedCalendarPredictions: [],
    })),
}));
