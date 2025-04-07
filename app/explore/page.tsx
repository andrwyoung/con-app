"use client";

import Map from "@/app/explore/map/map";
import { useExploreEvents } from "@/hooks/use-explore-events";
import Sidebar from "@/components/sidebar/sidebar";

export default function ExplorePage() {
  const { location, events, updateLocation } = useExploreEvents();

  return (
    <div className="font-extrabold">
      <Sidebar searchHandler={updateLocation} />
      <Map location={location} events={events} />
    </div>
  );
}
