import React, { useState } from "react";
import { Input } from "../ui/input";

export default function searchbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
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
