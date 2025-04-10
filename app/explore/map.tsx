import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { ConLocation, EventInfo } from "@/types/types";
import addMarkersToMap from "./map/markers";
import { useMapStore } from "@/stores/map-store";

export default function Map({
  initLocation,
  events,
  eventsLoaded,
}: {
  initLocation: ConLocation;
  events: EventInfo[];
  eventsLoaded: boolean;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // initial mount of map
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

    // create the map
    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/andrwyoung/cm93lxid4003c01rihwc1844d",
      center: [initLocation.longitude, initLocation.latitude],
      zoom: 8,
    });

    new mapboxgl.Marker()
      .setLngLat([12.554729, 55.70651])
      .addTo(mapRef.current);

    new mapboxgl.Marker({ color: "black", rotation: 45 })
      .setLngLat([12.65147, 55.608166])
      .addTo(mapRef.current);

    return () => mapRef.current?.remove();
  }, [initLocation.latitude, initLocation.longitude]);

  // render all the markers once fetched
  useEffect(() => {
    if (!mapRef.current || !eventsLoaded) return;
    addMarkersToMap(mapRef.current, events);
  }, [events, eventsLoaded]);

  // utility function to fly to where-ever
  const flyTo = (location: ConLocation, zoom = 10) => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [location.longitude, location.latitude],
      zoom,
      speed: 1.2,
      curve: 1,
      essential: true,
    });
  };

  // add flyTo to zustand so we can access it anywhere
  useEffect(() => {
    useMapStore.getState().setFlyTo(flyTo);
  });

  return <div id="map" ref={mapContainerRef} style={{ height: "100%" }}></div>;
}
