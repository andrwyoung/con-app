import { create } from "zustand";

type UIStore = {
    loginOpen: boolean;
    onboardingOpen: boolean;
    profileOpen: boolean;
    setLoginOpen: (open: boolean) => void;
    setOnboardingOpen: (open: boolean) => void;
    setProfileOpen: (open: boolean) => void;
    anyModalOpen: () => boolean;
  };
  
  export const useUIStore = create<UIStore>((set, get) => ({
    loginOpen: false,
    onboardingOpen: false,
    profileOpen: false,
  
    setLoginOpen: (open) => set({ loginOpen: open }),
    setOnboardingOpen: (open) => set({ onboardingOpen: open }),
    setProfileOpen: (open) => set({ profileOpen: open }),
  
    anyModalOpen: () => {
      const s = get();
      return s.loginOpen || s.onboardingOpen || s.profileOpen;
    },
  }));