import { ConventionInfo } from "@/types/con-types";
import { create } from "zustand";
import getAllEvents from "@/lib/map/get-all-events";

type EventStore = {
  allEvents: Record<number, ConventionInfo>;
  slugToId: Record<string, number>;

  initialized: boolean;
  fetchInProgress: Promise<ConventionInfo[]> | null;

  fetchAllEvents: () => Promise<ConventionInfo[]>;
  ensureInitialized: () => Promise<void>;
};
export const useEventStore = create<EventStore>((set, get) => ({
  allEvents: {},
  slugToId: {},
  initialized: false,
  fetchInProgress: null,   // prevent race conditions

  fetchAllEvents: async () => {
    const existingPromise = get().fetchInProgress;
    if (existingPromise) {
      await existingPromise;
      return Object.values(get().allEvents);
    }

    const fetchPromise = (async () => {
      try {
        const events = await getAllEvents();
        set({
          allEvents: Object.fromEntries(events.map((e) => [e.id, e])),
          slugToId: Object.fromEntries(events.map((e) => [e.slug, e.id])),
          initialized: true,
          fetchInProgress: null,
        });
        return events;
      } catch (err) {
        console.error("Failed to fetch events", err);
        set({ fetchInProgress: null });
        return [];
      }
    })();

    set({ fetchInProgress: fetchPromise });
    return await fetchPromise;
  },

  // prevent race conditions
  ensureInitialized: async () => {
    if (!get().initialized) {
      await get().fetchAllEvents();
    }
  },
}));