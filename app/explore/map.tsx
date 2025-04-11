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
import {
  DEFAULT_ZOOM,
  DEFAULT_ZOOM_FAR,
  ZOOM_USE_DEFAULT,
} from "@/lib/constants";
import { getDistance } from "@/lib/utils";

export default function Map({ initLocation }: { initLocation: ConLocation }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { isLoading: eventsStillLoading, allEvents: eventDict } =
    useEventStore();
  const { selectedCon, setSelectedCon, setSidebarModeAndDeselectCon } =
    useSidebarStore();
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
  }, [
    eventsStillLoading,
    eventDict,
    setFocusedEvents,
    setSelectedCon,
    setSidebarModeAndDeselectCon,
  ]);

  const getCurrentCenter = () => {
    if (!mapRef.current) return null;
    return mapRef.current.getCenter().toArray() as [number, number];
  };

  // utility function to fly to whereever
  const flyTo = (location: ConLocation, zoom?: number) => {
    if (!mapRef.current) return;

    const center = [location.longitude, location.latitude] as [number, number];
    const currentCenter = mapRef.current.getCenter().toArray() as [
      number,
      number
    ];
    const distance = getDistance(center, currentCenter);

    if (zoom === ZOOM_USE_DEFAULT) {
      if (distance > 30) {
        mapRef.current.easeTo({
          center,
          zoom: DEFAULT_ZOOM_FAR,
          speed: 2.5,
          curve: 1,
          essential: true,
        });
      } else {
        mapRef.current.flyTo({
          center,
          zoom: DEFAULT_ZOOM,
          speed: 1.2,
          curve: 1,
          essential: true,
        });
      }
    } else if (typeof zoom === "number") {
      mapRef.current.flyTo({
        center,
        zoom,
        speed: 1.2,
        curve: 1,
        essential: true,
      });
    } else {
      mapRef.current.easeTo({
        center,
        speed: 0.5,
        curve: 1,
        essential: true,
      });
    }
  };

  useEffect(() => {
    const flyToMyLocation = () => {
      const center = useMapStore.getState().userLocation;
      if (!mapRef.current || !center) return;

      mapRef.current.flyTo({
        center: [center.longitude, center.latitude],
        zoom: DEFAULT_ZOOM,
        speed: 1.5,
        curve: 1.2,
      });
    };

    useMapStore.getState().setFlyToMyLocation(flyToMyLocation);
  }, []);

  // add flyTo to zustand so we can access it anywhere
  useEffect(() => {
    useMapStore.getState().setFlyTo(flyTo);
  }, []);

  // add getCurrentCenter so we can use it anywhere
  useEffect(() => {
    useMapStore.getState().setGetCurrentCenter(getCurrentCenter);
  }, []);

  // clear points on map whenever a con is selected
  useEffect(() => {
    if (!mapRef.current) return;
    if (!selectedCon) {
      useMapStore.getState().clearSelectedPointHighlight?.();
    } else {
      useMapStore.getState().highlightPointOnMap?.(selectedCon.id);

      const el = document.createElement("div");
      el.className = "custom-marker";

      const marker = new mapboxgl.Marker({
        // element: el,
        color: "#7976D9",
        offset: [0, -20],
      })
        .setLngLat([selectedCon.longitude, selectedCon.latitude])
        .addTo(mapRef.current);
      return () => {
        if (marker) marker.remove();
      };
    }
  }, [selectedCon]);

  return <div id="map" ref={mapContainerRef} style={{ height: "100%" }}></div>;
}
