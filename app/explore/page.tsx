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

  const [showMap, setShowMap] = useState(false);

  // initialization
  // 1: initial coordinates to center the map
  // 2: load all events in the background
  // TODO memoize events
  useEffect(() => {
    const init = async () => {
      const coords = await getInitialLocation();
      if (coords) setInitLocation(coords); // ⏱ update map fast

      getAllEvents().then((events) => {
        setEvents(events);
        setEventsLoaded(true);
      });
    };

    init();
  }, []);

  // manual timer for a spinner lol
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMap(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen font-extrabold">
      <Sidebar />
      <div
        className={`flex flex-row gap-4 items-center justify-center -z-10 absolute inset-0`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-4 border-primary-muted" />
        <div className="text-lg  text-primary-muted">
          Loading Conventions...
        </div>
      </div>
      <div
        className={`transition-opacity duration-800 h-full ${
          showMap ? "opacity-100" : "opacity-0"
        }`}
      >
        {initLocation && (
          <Map
            initLocation={initLocation}
            events={events}
            eventsLoaded={eventsLoaded}
          />
        )}
      </div>
    </div>
  );
}
