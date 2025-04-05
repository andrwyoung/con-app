"use client";

import SearchBar from "@/components/sidebar/SearchBar";
import Map from "@/app/explore/map/Map";
import { useExploreEvents } from "@/hooks/useExploreEvents";
import Sidebar from "@/components/Sidebar";

export default function ExplorePage() {
  const { location, events, updateLocation } = useExploreEvents();

  return (
    <div className="font-extrabold">
      {/* <h1>Event Map</h1>
      <SearchBar onLocationChange={updateLocation} /> */}
      <Sidebar />
      <Map location={location} events={events} />
    </div>
  );
}
