import React from "react";
import SearchBar from "./searchbar";
import { ConLocation } from "@/types/types";

export default function Sidebar({
  searchHandler,
}: {
  searchHandler: (loc: ConLocation) => void;
}) {
  return (
    <div className="absolute  z-10 top-36 left-8 w-80 h-180 rounded-lg shadow-lg bg-white p-6">
      <SearchBar onLocationChange={searchHandler} />
    </div>
  );
}
