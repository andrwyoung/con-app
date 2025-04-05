"use client";
import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { ConLocation, EventInfo } from "@/types/types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

export default function Map({
  location,
  events,
}: {
  location?: ConLocation | null;
  events: EventInfo[];
}) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [centeredAt, setCenteredAt] = useState<[number, number]>([
    -122.4194, 37.7749,
  ]);

  useEffect(() => {
    if (location) {
      setCenteredAt([location.latitude, location.longitude]);
    }

    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/andrwyoung/cm93lxid4003c01rihwc1844d",
        center: centeredAt,
        zoom: 9,
        attributionControl: false,
      });

      // navigation controls
      map.addControl(new mapboxgl.NavigationControl());

      setMap(map);
    };

    if (!map) {
      initializeMap();
    }

    // Update map when location changes
    if (location) {
      console.log("Flying to location:", location);
      map?.flyTo({
        center: [location.longitude, location.latitude],
        essential: true,
      });
    }
  }, [location, map]);

  useEffect(() => {
    // Add event markers to the map
    if (map && events && events.length > 0) {
      events.forEach((event) => {
        new mapboxgl.Marker()
          .setLngLat([event.longitude, event.latitude]) // Use event coordinates
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h3>${event.name}</h3><p>${event.date}</p>`
            )
          ) // Show event details in the popup
          .addTo(map);
      });
    }
  }, [map, events]);

  return (
    <div
      id="map"
      className="w-screen h-screen -z-10"
      style={{
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    />
  );
}
