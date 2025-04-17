"use client";
import useInitMapData from "@/hooks/use-init-map-data";
import { usePathname } from "next/navigation";
import Map from "./explore/map";

export default function MapWrapper() {
  const { initLocation, initialized } = useInitMapData();
  const showMap = usePathname() === "/explore";

  return (
    <>
      {initLocation && initialized && (
        <div
          className={`fixed inset-0 transition-opacity duration-300 z-0 ${
            showMap ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Map initLocation={initLocation} />
        </div>
      )}
    </>
  );
}
