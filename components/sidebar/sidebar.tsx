import React from "react";
import SearchBar from "./searchbar";

export default function Sidebar() {
  return (
    <div className="absolute z-10 top-36 left-8 w-80 max-h-180 h-full rounded-lg shadow-lg bg-white p-6 overflow-y-auto">
      <SearchBar />
    </div>
  );
}
