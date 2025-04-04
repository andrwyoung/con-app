
"use client"; 

import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Map from '../components/Map';
import { supabase } from '../lib/supabase';




const Home = () => {
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);

  const handleLocationChange = async (newLocation) => {
    if (!newLocation || !newLocation.latitude || !newLocation.longitude) {
      console.error("Invalid location:", newLocation);
      return;
    }
    setLocation(newLocation);
    
    try {

      const { data, error } = await supabase
        .from("full_convention_table")
        .select("*")
        .gte("latitude", newLocation.latitude - 1)
        .lte("latitude", newLocation.latitude + 1)
        .gte("longitude", newLocation.longitude - 1)
        .lte("longitude", newLocation.longitude + 1);
  
      if (error) throw error;
  
      console.log("Fetched events:", data);  
      setEvents(data);
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