"use client";
import Sidebar from "@/components/sidebar/sidebar";
import Map from "./map";

export default function ExplorePage() {
  return (
    <div className="w-screen h-screen font-extrabold">
      <Sidebar />
      <Map />
    </div>
  );
}
