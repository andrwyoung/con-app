"use client";

import Map from "@/app/explore/map/Map";
import { useExploreEvents } from "@/hooks/useExploreEvents";
import Sidebar from "@/components/Sidebar";

export default function ExplorePage() {
  const { location, events, updateLocation } = useExploreEvents();

  return (
    <div className="font-extrabold">
      <Sidebar searchHandler={updateLocation} />
      <Map location={location} events={events} />
    </div>
  );
}
