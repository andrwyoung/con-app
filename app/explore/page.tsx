"use client";
import Sidebar from "@/components/sidebar/sidebar";
import Map from "./map";
import { useEffect, useState } from "react";
import { ConLocation, EventInfo } from "@/types/types";
import getInitialLocation from "./map/get-initial-location";
import getAllEvents from "./map/get-all-events";

export default function ExplorePage() {
  const [initLocation, setInitLocation] = useState<ConLocation | null>(null);

  const [events, setEvents] = useState<EventInfo[]>([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [coords, events] = await Promise.all([
        getInitialLocation(),
        getAllEvents(),
      ]);

      if (coords) setInitLocation(coords);
      setEvents(events);
      setEventsLoaded(true);
    };

    init();
  }, []);

  return (
    <div className="w-screen h-screen font-extrabold">
      <Sidebar />
      {initLocation && (
        <Map
          initLocation={initLocation}
          events={events}
          eventsLoaded={eventsLoaded}
        />
      )}
    </div>
  );
}
