"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Map from "../components/Map";
import { supabase } from "../lib/supabase";

type Location = {
  latitude: number;
  longitude: number;
};

const Home = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [events, setEvents] = useState([]);

  const handleLocationChange = async (newLocation: Location) => {
    if (!newLocation || !newLocation.latitude || !newLocation.longitude) {
      console.error("Invalid location:", newLocation);
      return;
    }
    setLocation(newLocation);

    try {
      const { data, error } = await supabase
        .from("full_convention_table")
        .select("*")
        .limit(3);
      // .gte("latitude", newLocation.latitude - 1)
      // .lte("latitude", newLocation.latitude + 1)
      // .gte("longitude", newLocation.longitude - 1)
      // .lte("longitude", newLocation.longitude + 1);

      if (error) throw error;

      console.log("Fetched events:", data);
      // setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  return (
    <div>
      <h1>Event Map</h1>
      <SearchBar onLocationChange={handleLocationChange} />
      <Map location={location} events={events} />
    </div>
  );
};

export default Home;

// app/page.tsx
