import { useState } from 'react';
import { supabase } from '../lib/supabase';

const SearchBar = ({ onLocationChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=pk.eyJ1Ijoic3Vuc2NhcnIiLCJhIjoiY205MHJ5Mno1MDFmMDJpcHg4MXIyY25lNSJ9.HGhkRRY7U6jAgdsPolBufQ`;
    
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const { center } = data.features[0]; // Get the first feature's center (longitude, latitude)
      const [longitude, latitude] = center;

      // Call the parent function with the new location
      onLocationChange({ latitude, longitude });

      // Fetch events from Supabase
      await fetchEvents(latitude, longitude);
    }
  };

  const fetchEvents = async (latitude, longitude) => {
    const { data, error } = await supabase
      .from('full_convention_table')
      .select('*')
      .gte('latitude', latitude - 0.1)
      .lte('latitude', latitude + 0.1)
      .gte('longitude', longitude - 0.1)
      .lte('longitude', longitude + 0.1);

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    console.log('Events:', data);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for location"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
