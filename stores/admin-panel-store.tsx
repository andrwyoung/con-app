import { create } from "zustand";

export type MinimumDetailPanelProps = {
  conId: number;
  conName: string;
};

type AdminPanelStore = {
  selectedCon: MinimumDetailPanelProps | null;
  setSelectedCon: (s: MinimumDetailPanelProps | null) => void;
};

export const useAdminPanelStore = create<AdminPanelStore>((set) => ({
  selectedCon: null,
  setSelectedCon: (s: MinimumDetailPanelProps | null) =>
    set({ selectedCon: s }),
}));
