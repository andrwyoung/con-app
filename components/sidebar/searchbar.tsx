import React, { useState } from "react";
import { Input } from "../ui/input";
import { useMapStore } from "@/stores/map-store";

export default function Searchbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const flyTo = useMapStore((s) => s.flyTo);

  const handleSearch = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (flyTo) flyTo({ latitude: 100, longitude: 30 }, 5);
  };

  return (
    <form onSubmit={handleSearch}>
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for Conventions"
      />
    </form>
  );
}
