import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { ConLocation } from "@/types/types";
import addMarkersToMap from "./map/markers";
import { useMapStore } from "@/stores/map-store";
import { useEventStore } from "@/stores/all-events-store";
import {
  useMapCardsStore,
  useSidebarStore,
} from "@/stores/explore-sidebar-store";

export default function Map({ initLocation }: { initLocation: ConLocation }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { isLoading: eventsStillLoading, allEvents: eventDict } =
    useEventStore();
  const { setSelectedCon, setSidebarModeAndDeselectCon } = useSidebarStore();
  const { setFocusedEvents } = useMapCardsStore();

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
    console.log("dict2", eventDict, eventsStillLoading, mapRef.current);
    if (
      !mapRef.current ||
      eventsStillLoading ||
      !eventDict ||
      Object.keys(eventDict).length === 0
    )
      return;

    addMarkersToMap(
      mapRef.current,
      eventDict,
      setSelectedCon,
      setSidebarModeAndDeselectCon,
      setFocusedEvents
    );
  }, [eventsStillLoading, eventDict]);

  // utility function to fly to where-ever
  const flyTo = (location: ConLocation, zoom?: number) => {
    if (!mapRef.current) return;

    if (zoom !== undefined) {
      mapRef.current.flyTo({
        center: [location.longitude, location.latitude],
        speed: 1.2,
        zoom,
        curve: 1,
        essential: true,
      });
    } else {
      mapRef.current.easeTo({
        center: [location.longitude, location.latitude],
        speed: 0.5,
        curve: 1,
        essential: true,
      });
    }
  };

  // add flyTo to zustand so we can access it anywhere
  useEffect(() => {
    useMapStore.getState().setFlyTo(flyTo);
  }, []);

  const { selectedCon } = useSidebarStore();
  useEffect(() => {
    if (!mapRef.current) return;
    if (!selectedCon) {
      useMapStore.getState().clearSelectedPointHighlight?.();
    } else {
      useMapStore.getState().highlightPointOnMap?.(selectedCon.id);
    }

    // const marker = new mapboxgl.Marker()
    //   .setLngLat([selectedCon.longitude, selectedCon.latitude])
    //   .addTo(mapRef.current);

    // return () => {
    //   if (marker) marker.remove();
    // };
  }, [selectedCon]);

  return <div id="map" ref={mapContainerRef} style={{ height: "100%" }}></div>;
}
