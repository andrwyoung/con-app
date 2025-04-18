import { EventInfo } from "@/types/types";
import { create } from "zustand";

type DropStore ={
    dropList: EventInfo[],
    alreadyInDropList: (item: EventInfo) => boolean;
    addToDropList: (item: EventInfo) => void;
  };


export const useDropStore = create<DropStore>((set, get) => ({
    dropList: [],
    alreadyInDropList: (item) => {
        const current = get().dropList;
        return (current.some((c) => c.id === item.id)); 
    },
    addToDropList: (item) => {
      const current = get().dropList;
      if (current.some((c) => c.id === item.id)) return;
      set({ dropList: [...current, item] });
    },
  }));