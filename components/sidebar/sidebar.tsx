import React, { useState } from "react";
import SearchBar from "./searchbar";
import { EventInfo } from "@/types/types";

export default function Sidebar() {
  const [searchRes, setSearchRes] = useState<EventInfo[]>([]);

  return (
    <div className="absolute z-10 top-36 left-8 w-80 max-h-180 h-full rounded-lg shadow-lg bg-white p-6 overflow-y-auto">
      <SearchBar setSidebarResults={setSearchRes} />
    </div>
  );
}
