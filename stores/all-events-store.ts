import { EventInfo } from "@/types/types";
import { create } from "zustand";
import getAllEvents from "@/lib/map/get-all-events";

type EventStore = {
  allEvents: Record<number, EventInfo>;
  slugToId: Record<string, number>;
  fetchAllEvents: () => Promise<EventInfo[]>;
};

export const useEventStore = create<EventStore>((set) => ({
  allEvents: {},
  slugToId: {},
  fetchAllEvents: async () => {
    try {
      const events = await getAllEvents();
      set({
        allEvents: Object.fromEntries(events.map((e) => [e.id, e])),
        slugToId: Object.fromEntries(events.map((e) => [e.slug, e.id])),
      });
      return events;
    } catch (err) {
      console.error("Failed to fetch events", err);
      return [];
    }
  },
}));