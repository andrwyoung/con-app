import { authStep } from "@/components/auth/login-modal";
import { FilterKey } from "@/components/sidebar-panel/modes/filter-section";
import { DEFAULT_LIST } from "@/lib/constants";
import { ConventionInfo, Scope } from "@/types/types";
import { create, StateCreator } from "zustand";

type ModalUIStore = {
  loginModalStep: authStep;
  onboardingOpen: boolean;
  profileOpen: boolean;

  setLoginModalStep: (step: authStep) => void;
  setOnboardingOpen: (open: boolean) => void;
  setProfileOpen: (open: boolean) => void;
  anyModalOpen: () => boolean;
};
  
export const useModalUIStore = create<ModalUIStore>((set, get) => ({
  loginModalStep: "closed",
  onboardingOpen: false,
  profileOpen: false,

  setLoginModalStep: (step) => set({ loginModalStep: step }),
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
  setActiveCon: (con) => {console.log("dragging con:", con); set({ activeCon: con })},
}));

// overlapping UI stores
export function useScopedUIStore(scope: Scope): SearchStore {
  return scope === "explore" ? useExploreGeneralUIStore() : usePlanGeneralUIStore();
}

type SearchStore = {
  shownFilters: FilterKey[];
  setShownFilters: (key: FilterKey[]) => void;

  showingNow: string;
  setShowingNow: (listId: string) => void;
};

function createUIStoreInitializer(): StateCreator<SearchStore> {
  return (set) => ({
    showingNow: DEFAULT_LIST,
    setShowingNow: (listId) => set({ showingNow: listId }),

    shownFilters: [],
    setShownFilters: (key) => set({ shownFilters: key }),
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

  showListPanel: boolean;
  setShowListPanel: (r: boolean) => void;
};

export const useExploreUIStore = create<ExploreUIStore>((set) => ({
  showRecomended: true,
  setShowRecomended: (r) => set({ showRecomended: r }),

  showListPanel: true,
  setShowListPanel: (r) => set({ showListPanel: r }),
}));

