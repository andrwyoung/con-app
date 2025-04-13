// the map itelf
// this file is the central hub for how the rest of the app interacts with the map
// it handles mounting and utility functions

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { ConLocation } from "@/types/types";
import addMarkersToMap from "../../lib/map/add-markers";
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
  const { allEvents: eventDict } = useEventStore();
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

    // your location marker
    //   const el = document.createElement("div");
    //   el.style.backgroundImage = `url('/my-location5.png')`;
    //   el.style.width = "24px";
    //   el.style.height = "24px";
    //   el.style.backgroundSize = "contain";
    //   el.style.backgroundRepeat = "no-repeat";
    //   new mapboxgl.Marker({ element: el })
    //     .setLngLat([initLocation.longitude, initLocation.latitude])
    //     .addTo(mapRef.current);

    return () => mapRef.current?.remove();
  }, [initLocation.latitude, initLocation.longitude]);

  // render all the markers once events are fetched
  useEffect(() => {
    console.log("dict2", eventDict, mapRef.current);
    if (!mapRef.current || !eventDict || Object.keys(eventDict).length === 0)
      return;

    addMarkersToMap(
      mapRef.current,
      eventDict,
      setSelectedCon,
      setSidebarModeAndDeselectCon,
      setFocusedEvents
    );
  }, [
    eventDict,
    setFocusedEvents,
    setSelectedCon,
    setSidebarModeAndDeselectCon,
  ]);

  // clear all points on map whenever a con is selected
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

  // SECTION: utility functions for the mapStore
  //
  //

  // utility function to get coordinates of your current view
  const getCurrentCenter = () => {
    if (!mapRef.current) return null;
    const [lng, lat] = mapRef.current.getCenter().toArray();
    return { longitude: lng, latitude: lat };
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

  // utility function to center view on the user's location
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

  // add those functions to the store

  useEffect(() => {
    useMapStore.getState().setFlyToMyLocation(flyToMyLocation);
  }, []);
  useEffect(() => {
    useMapStore.getState().setFlyTo(flyTo);
  }, []);
  useEffect(() => {
    useMapStore.getState().setGetCurrentCenter(getCurrentCenter);
  }, []);

  return <div id="map" ref={mapContainerRef} style={{ height: "100%" }}></div>;
}
