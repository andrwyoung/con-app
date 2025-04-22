import { authStep } from "@/components/auth/login-modal";
import { FilterKey } from "@/components/sidebar-panel/modes/filter-mode";
import { ConventionInfo } from "@/types/types";
import { create } from "zustand";

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


type ExploreUIStore = {
  shownFilters: FilterKey[];
  setShownFilters: (key: FilterKey[]) => void;

  showRecomended: boolean;
  setShowRecomended: (r: boolean) => void;

  showListPanel: boolean;
  setShowListPanel: (r: boolean) => void;
};

export const useExploreUIStore = create<ExploreUIStore>((set) => ({
  shownFilters: [],
  setShownFilters: (key) => set({ shownFilters: key }),

  showRecomended: true,
  setShowRecomended: (r) => set({ showRecomended: r }),

  showListPanel: true,
  setShowListPanel: (r) => set({ showListPanel: r }),
}));



export const useDragStore = create<{
  activeCon: ConventionInfo | null;
  setActiveCon: (con: ConventionInfo | null) => void;
}>((set) => ({
  activeCon: null,
  setActiveCon: (con) => {console.log("dragging con:", con); set({ activeCon: con })},
}));