import { EventInfo } from "@/types/types";
import { create } from "zustand";
import getAllEvents from "@/lib/map/get-all-events";

type EventStore = {
  allEvents: Record<string, EventInfo>;
  fetchAllEvents: () => Promise<void>;
};

export const useEventStore = create<EventStore>((set) => ({
  allEvents: {},
  fetchAllEvents: async () => {
    try {
      const events = await getAllEvents();
      set({
        allEvents: Object.fromEntries(events.map((e) => [e.id, e])),
      });
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  },
}));