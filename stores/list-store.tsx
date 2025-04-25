import { DEFAULT_LISTS } from "@/lib/constants";
import {
  addListItemToSupabase,
  removeListItemFromSupabase,
} from "@/lib/lists/add-delete-items";
import {
  createListInSupabase,
  deleteListFromSupabase,
  renameListInSupabase,
} from "@/lib/lists/add-delete-lists";
import {
  getConventionYearId,
  isSameListItem,
} from "@/lib/lists/helper-functions";
import { ensureAllDefaultsExist } from "@/lib/lists/sync-lists";
import { ConventionInfo } from "@/types/types";
import { create } from "zustand";

export type UserList = {
  label: string;
  items: ConventionInfo[];
};

export type ListStore = {
  lists: Record<string, UserList>;
  setLists: (e: Record<string, UserList>) => void;
  resetLists: () => void;

  addToList: (listId: string, item: ConventionInfo) => void;
  removeFromList: (listId: string, item: ConventionInfo) => void;
  alreadyInList: (listId: string, item: ConventionInfo) => boolean;

  createList: (id: string, label: string) => void;
  renameList: (id: string, newLabel: string) => void;
  deleteList: (id: string) => void;
};

export const useListStore = create<ListStore>((set, get) => ({
  lists: DEFAULT_LISTS,
  setLists: (newLists) => {
    if (!newLists || Object.keys(newLists).length === 0) {
      console.warn(
        "setLists received empty or undefined — falling back to DEFAULT_LISTS."
      );
      set({ lists: DEFAULT_LISTS });
      return;
    }

    const withDefaults = ensureAllDefaultsExist(newLists);
    set({ lists: withDefaults });
  },
  resetLists: () => set({ lists: DEFAULT_LISTS }),

  addToList: (listId, con) => {
    const current = get().lists[listId];
    const itemYearId = getConventionYearId(con);

    addListItemToSupabase({
      listId,
      conventionId: con.id,
      conventionYearId: itemYearId,
    });

    // unlabeled list situation
    if (!current) {
      set((state) => ({
        lists: {
          ...state.lists,
          [listId]: {
            label: "Unnamed List",
            items: [con],
          },
        },
      }));
      return;
    }

    set((state) => ({
      lists: {
        ...state.lists,
        [listId]: {
          ...current,
          items: [
            ...current.items.filter(
              (existingItem) => !isSameListItem(existingItem, con)
            ),
            con,
          ],
        },
      },
    }));
  },

  removeFromList: (listId, con) => {
    const itemYearId = getConventionYearId(con);

    removeListItemFromSupabase({
      listId,
      conventionId: con.id,
      conventionYearId: itemYearId,
    });
    const current = get().lists[listId];
    if (!current) return;

    set((state) => ({
      lists: {
        ...state.lists,
        [listId]: {
          ...current,
          items: current.items.filter(
            (c) => !(c.id === con.id && getConventionYearId(c) === itemYearId)
          ),
        },
      },
    }));
  },

  alreadyInList: (listId, item) => {
    const current = get().lists[listId];
    if (!current) return false;

    return current.items.some((c) => isSameListItem(c, item));
  },

  createList: (id: string, label: string) => {
    createListInSupabase({ listId: id, label });
    set((state) => ({
      lists: {
        ...state.lists,
        [id]: {
          label,
          items: [],
        },
      },
    }));
  },

  renameList: (id: string, newLabel: string) => {
    const current = get().lists[id];

    if (!current) {
      console.warn(`Tried to rename list that doesn't exist: "${id}"`);
      return;
    }

    renameListInSupabase({ listId: id, newLabel });

    set((state) => ({
      lists: {
        ...state.lists,
        [id]: {
          ...state.lists[id],
          label: newLabel,
        },
      },
    }));
  },

  deleteList: (id: string) => {
    // optimistically remove from local state
    set((state) => {
      const newLists = { ...state.lists };
      delete newLists[id];
      return { lists: newLists };
    });

    // remove from Supabase
    deleteListFromSupabase({ listId: id }).catch(console.error);
  },
}));
