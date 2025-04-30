// all things related to keeping UI persitant
// including the controls to opening/closing modals

import { authStep } from "@/components/auth/login-modal";
import { FilterKey } from "@/components/sidebar-panel/modes/filter-section";
import { log } from "@/lib/utils";
import { SortType } from "@/types/sort-types";
import { ConventionInfo, Scope } from "@/types/con-types";
import { create, StateCreator } from "zustand";
import { EditorSteps } from "@/components/edit-modal/edit-con-modal";

type ModalUIStore = {
  loginModalStep: authStep;
  editingModalPage: EditorSteps;
  onboardingOpen: boolean;
  profileOpen: boolean;

  setLoginModalStep: (step: authStep) => void;
  setEditingModalPage: (step: EditorSteps) => void;
  setOnboardingOpen: (open: boolean) => void;
  setProfileOpen: (open: boolean) => void;
  anyModalOpen: () => boolean;
};
  
export const useModalUIStore = create<ModalUIStore>((set, get) => ({
  loginModalStep: "closed",
  editingModalPage: "closed",
  onboardingOpen: false,
  profileOpen: false,

  setLoginModalStep: (step) => set({ loginModalStep: step }),
  setEditingModalPage: (step) => set({ editingModalPage: step }),
  setOnboardingOpen: (open) => set({ onboardingOpen: open }),
  setProfileOpen: (open) => set({ profileOpen: open }),

  anyModalOpen: () => {
    const s = get();
    return s.loginModalStep !== "closed"  || s.onboardingOpen || s.profileOpen;
  },
}));


export const useDragStore = create<{
  activeCon: ConventionInfo | null;
  setActiveCon: (con: ConventionInfo | null) => void;
}>((set) => ({
  activeCon: null,
  setActiveCon: (con) => {log("dragging con:", con); set({ activeCon: con })},
}));


// overlapping UI stores
export function useScopedUIStore(scope: Scope): SearchStore {
  return scope === "explore" ? useExploreGeneralUIStore() : usePlanGeneralUIStore();
}

type SearchStore = {
  listSortType: SortType;
  setListSortType: (sort: SortType) => void;

  shownFilters: FilterKey[];
  setShownFilters: (key: FilterKey[]) => void;

  showListPanel: boolean;
  setShowListPanel: (r: boolean) => void;
};

function createUIStoreInitializer(): StateCreator<SearchStore> {
  return (set) => ({
    listSortType: "raw",
    setListSortType: (sort) => set({listSortType: sort}),

    shownFilters: [],
    setShownFilters: (key) => set({ shownFilters: key }),

    showListPanel:false,
    setShowListPanel: (r) => set({ showListPanel: r }),
  });
}

export const useExploreGeneralUIStore = create<SearchStore>(
  createUIStoreInitializer()
);
export const usePlanGeneralUIStore = create<SearchStore>(
  createUIStoreInitializer()
);

type ExploreUIStore = {
  showRecomended: boolean;
  setShowRecomended: (r: boolean) => void;

  showMobileDrawer: boolean;
  setShowMobileDrawer: (r: boolean) => void;
};

export const useExploreUIStore = create<ExploreUIStore>((set) => ({
  showRecomended: true,
  setShowRecomended: (r) => set({ showRecomended: r }),

  showMobileDrawer: false,
  setShowMobileDrawer: (r) => set({ showMobileDrawer: r }),
}));

type PlanUIStore = {
  scrolledToToday: boolean;
  setScrolledToToday: (r: boolean) => void;
};

export const usePlanUIStore = create<PlanUIStore>((set) => ({
  scrolledToToday: false,
  setScrolledToToday: (r) => set({ scrolledToToday: r }),
}));
