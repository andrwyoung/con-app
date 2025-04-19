import { addListItemToSupabase, removeListItemFromSupabase } from "@/lib/lists/add-delete-items";
import { ConventionInfo } from "@/types/types";
import { create } from "zustand";

type UserList = {
  label: string;
  items: ConventionInfo[];
};

export type ListStore = {
  lists: Record<string, UserList>;
  setLists: (e: Record<string, UserList>) => void;

  showingNow: string; 
  setShowingNow: (listId: string) => void;

  addToList: (listId: string, item: ConventionInfo) => void;
  removeFromList: (listId: string, itemId: number) => void;
  alreadyInList: (listId: string, item: ConventionInfo) => boolean;
};


  export const useListStore = create<ListStore>((set, get) => ({
    lists: {
      planning: {
        label: "Planning to Go",
        items: [],
      },
      interested: {
        label: "Interested In",
        items: [],
      },
    },
    setLists: (newLists) => set({ lists: newLists }),
  
    showingNow: "planning",
    setShowingNow: (listId) => set({ showingNow: listId }),
  
    addToList: (listId, item) => {
      const current = get().lists[listId];

      addListItemToSupabase({
        listId,
        conventionId: item.id,
      });
      if (!current) { // unlabeled list situation
        set((state) => ({
          lists: {
            ...state.lists,
            [listId]: {
              label: "Unnamed List", 
              items: [item],
            },
          },
        }));
        return;
      }
      if (current.items.some((c) => c.id === item.id)) return;
    
      set((state) => ({
        lists: {
          ...state.lists,
          [listId]: {
            ...current,
            items: [...current.items, item],
          },
        },
      }));
    },
  
    removeFromList: (listId, itemId) => {

      removeListItemFromSupabase({
        listId,
        conventionId: itemId,
      });
      const current = get().lists[listId];
      if (!current) return;
    
      set((state) => ({
        lists: {
          ...state.lists,
          [listId]: {
            ...current,
            items: current.items.filter((c) => c.id !== itemId),
          },
        },
      }));
    },
  
    alreadyInList: (listId, item) => {
      const current = get().lists[listId] || [];
      return current.items.some((c) => c.id === item.id);
    },
  }));