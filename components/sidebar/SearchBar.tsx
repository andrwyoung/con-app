import { ConLocation } from "@/types/types";
import { useState } from "react";

export default function SearchBar({
  onLocationChange,
}: {
  onLocationChange: (loc: ConLocation) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      searchQuery
    )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const { center } = data.features[0]; // Get the first feature's center (longitude, latitude)
      const [longitude, latitude] = center;

      // Call the parent function with the new location
      onLocationChange({ latitude, longitude });
    }
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
}
