"use client";

import SearchBar from "@/components/SearchBar";
import Map from "@/app/explore/map/Map";
import { useExploreEvents } from "@/hooks/useExploreEvents";

export default function Explore() {
  const { location, events, updateLocation } = useExploreEvents();

  return (
    <div className="w-full h-full">
      <h1>Event Map</h1>
      <SearchBar onLocationChange={updateLocation} />
      <Map location={location} events={events} />
    </div>
  );
}
