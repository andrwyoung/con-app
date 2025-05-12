import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import React, { useRef, useEffect, useState } from "react";
import { MINIMAP_ZOOM } from "@/lib/constants";
import Image from "next/image";

export default function MapboxMiniMap({
  lat,
  long,
  onUpdate,
}: {
  lat: number;
  long: number;
  onUpdate: (coords: { lat: number; long: number }) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

    mapRef.current = new mapboxgl.Map({
      container: "mini-map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [long, lat],
      zoom: MINIMAP_ZOOM,
      attributionControl: false,
    });

    setTimeout(() => setHasMounted(true), 300);

    return () => mapRef.current?.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="relative h-[200px] w-full rounded-md overflow-hidden border">
        <div
          className={`w-full h-full transition-opacity duration-700 ${
            hasMounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            id="mini-map"
            ref={mapContainerRef}
            style={{ height: "100%", opacity: "75%" }}
          ></div>

          {/* Center marker icon (styled like Mapbox’s default pin) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
            <Image
              src="/custom_marker.png"
              alt="Map marker"
              width={24}
              height={24}
              unoptimized
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center px-2">
        <p
          className="text-sm text-primary-text cursor-pointer hover:underline transition"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.easeTo({ center: [long, lat] });
            }
          }}
          title="Click to re-center map"
        >
          <span className="font-bold">Current: </span>
          {lat.toFixed(4)}, {long.toFixed(4)}
        </p>
        <button
          type="button"
          className="text-xs border-2 border-primary px-3 py-1 bg-primary text-text-primary rounded-md
      cursor-pointer hover:bg-primary-light w-fit"
          onClick={() => {
            if (mapRef.current) {
              const center = mapRef.current.getCenter();
              onUpdate({ lat: center.lat, long: center.lng });
            }
          }}
        >
          Set New Location
        </button>
      </div>
    </>
  );
}
