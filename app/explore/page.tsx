"use client";

import SearchBar from "@/components/sidebar/SearchBar";
import Map from "@/app/explore/map/Map";
import { useExploreEvents } from "@/hooks/useExploreEvents";

export default function Explore() {
  const { location, events, updateLocation } = useExploreEvents();

  return (
    <div className="font-extrabold">
      {/* <h1>Event Map</h1>
      <SearchBar onLocationChange={updateLocation} /> */}
      <Map location={location} events={events} />
    </div>
  );
}
