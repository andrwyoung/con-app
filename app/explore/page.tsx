"use client";

import { useExploreEvents } from "@/hooks/use-explore-events";
import Sidebar from "@/components/sidebar/sidebar";
import MapboxExample from "./mapt";

export default function ExplorePage() {
  const { location, events, updateLocation } = useExploreEvents();

  return (
    <div className="w-screen h-screen font-extrabold">
      <Sidebar searchHandler={updateLocation} />
      <MapboxExample events={events} />
    </div>
  );
}
