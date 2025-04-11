import { EventInfo } from "@/types/types";
import { create } from "zustand";
import getAllEvents from "@/app/explore/map/get-all-events";

type EventStore = {
  allEvents: Record<string, EventInfo>;
  isLoading: boolean;
  fetchAllEvents: () => Promise<void>;
};

export const useEventStore = create<EventStore>((set) => ({
  allEvents: {},
  isLoading: true,
  fetchAllEvents: async () => {
    try {
      const events = await getAllEvents();
      set({
        allEvents: Object.fromEntries(events.map((e) => [e.id, e])),
      });
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));