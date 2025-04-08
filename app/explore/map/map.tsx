"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import maplibregl from "maplibre-gl";
import { ConLocation, EventInfo } from "@/types/types";

const maptiler_key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
const mapStyles = ["dataviz-light", "outdoor", "satellite", "bright", "basic"];
const mapTilerBaseUrl = "https://api.maptiler.com/maps/";

const getStyleUrl = (style: string) => {
  return `${mapTilerBaseUrl}${style}/style.json?key=${maptiler_key}`;
};

export default function Map({
  location,
  events,
}: {
  location?: ConLocation | null;
  events: EventInfo[];
}) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [selectedStyleName, setSelectedStyleName] = useState<string>("dataviz-light");
  const [centeredAt, setCenteredAt] = useState<[number, number]>([
    -122.4194, 37.7749,
  ]);

  useEffect(() => {
    // Update the center coordinates when the location changes
    if (location) {
      setCenteredAt([location.latitude, location.longitude]);
    }
  }, [location]);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = new maplibregl.Map({
        container: "map",
        style: getStyleUrl("dataviz-light"),
        center: centeredAt,
        zoom: 9,
        attributionControl: false,
      });

      mapInstance.addControl(new maplibregl.NavigationControl());
      mapInstance.on("load", () => {
        console.log("Map loaded");
        mapRef.current = mapInstance;
      });
    }

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(getStyleUrl(selectedStyleName));
    }
  }, [selectedStyleName]);

  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.flyTo({
        center: [location.longitude, location.latitude],
        essential: true,
        zoom: 12,
      });
    }
  }, [location]);

  // Memoize events array to avoid unnecessary re-renders
  const memoizedEvents = useMemo(() => events, [events]);

  useEffect(() => {
    console.log("Map is not initialized");
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    memoizedEvents.forEach((event) => {
      if (event.latitude && event.longitude && !isNaN(event.latitude) && !isNaN(event.longitude)) {
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<h3>${event.name}</h3><p>${event.date}</p>`
        );

        const marker = new maplibregl.Marker()
          .setLngLat([event.longitude, event.latitude])
          .setPopup(popup)
          .addTo(mapRef.current!);
        // Add event listener for marker click to open popup
        marker.getElement().addEventListener("click", () => {
          marker.togglePopup();
        });

        marker.getPopup().addTo(mapRef.current!);
        markersRef.current.push(marker);
        console.log(`Marker for event "${event.name}" added at [${event.longitude}, ${event.latitude}]`);
      } else {
        console.log("Invalid latitude or longitude for event:", event);
      }
    });
  }, [memoizedEvents]);

  const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStyleName(event.target.value);
  };

  return (
    <div>
      <div
        className="font-extrabold"
        style={{ position: "absolute", bottom: "10px", right: "10px", zIndex: 10 }}
      >
        <select
          onChange={handleStyleChange}
          value={selectedStyleName}
          style={{ padding: "10px", fontSize: "16px", zIndex: 100 }}
        >
          {mapStyles.map((style, index) => (
            <option key={index} value={style}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div
        id="map"
        className="w-screen h-screen -z-10"
        style={{
          padding: 0,
          margin: 0,
          overflow: "hidden",
        }}
      />
    </div>
  );
}
