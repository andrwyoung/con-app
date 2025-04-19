import { authStep } from "@/components/auth/login-modal";
import { ConventionInfo } from "@/types/types";
import { create } from "zustand";

type UIStore = {
  loginModalStep: authStep;
  onboardingOpen: boolean;
  profileOpen: boolean;

  setLoginModalStep: (step: authStep) => void;
  setOnboardingOpen: (open: boolean) => void;
  setProfileOpen: (open: boolean) => void;
  anyModalOpen: () => boolean;

  shouldScrollToLocation: boolean;
  setShouldScrollToLocation: (val: boolean) => void;
};
  
export const useUIStore = create<UIStore>((set, get) => ({
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

  shouldScrollToLocation: false,
  setShouldScrollToLocation: (val) => set({ shouldScrollToLocation: val}),
}));



export const useDragStore = create<{
  activeCon: ConventionInfo | null;
  setActiveCon: (con: ConventionInfo | null) => void;
}>((set) => ({
  activeCon: null,
  setActiveCon: (con) => {console.log("dragging con:", con); set({ activeCon: con })},
}));