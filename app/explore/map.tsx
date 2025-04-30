// the map itelf
// this file is the central hub for how the rest of the app interacts with the map
// it handles mounting and utility functions

import React, { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { ConLocation } from "@/types/con-types";
import addMarkersToMap from "../../lib/map/add-markers";
import { useMapPinsStore, useMapStore } from "@/stores/map-store";
import { useEventStore } from "@/stores/all-events-store";
import {
  DEFAULT_ZOOM,
  DEFAULT_ZOOM_FAR,
  ZOOM_USE_DEFAULT,
} from "@/lib/constants";
import { getDistance, log } from "@/lib/utils";
import { useFilterStore } from "@/stores/filter-store";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import {
  useExploreSelectedCardsStore,
  useExploreSidebarStore,
} from "@/stores/page-store";

export default function Map({ initLocation }: { initLocation: ConLocation }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { allEvents: eventDict } = useEventStore();
  const { setSidebarMode, setSelectedClusterId } = useExploreSidebarStore();
  const { setFocusedEvents, selectedCon, setSelectedCon } =
    useExploreSelectedCardsStore();

  const setFilteredItems = useFilterStore((s) => s.setFilteredItems);
  const tagFilter = useFilterStore((s) => s.tagFilter);
  const selectedStatuses = useFilterStore((s) => s.selectedStatuses);
  const tagFilterIsActive = useFilterStore((s) => s.tagFilterIsActive)();
  const statusFilterIsActive = useFilterStore((s) => s.statusFilterIsActive)();

  const tempPinCons = useMapPinsStore((s) => s.tempPins);

  useEffect(() => {
    console.time("map render");
    return () => console.timeEnd("map render");
  }, []);

  // initial mount of map
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

    // create the map
    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/andrwyoung/cm9gka3jp00ep01rcg0k1dy0a",
      center: [initLocation.longitude, initLocation.latitude],
      zoom: DEFAULT_ZOOM_FAR,
    });
    mapRef.current.getCanvas().style.cursor = "default";

    return () => mapRef.current?.remove();
  }, [initLocation.latitude, initLocation.longitude]);

  // SECTION: rendering markers based off of filters
  //
  //

  // create filteredDict
  const filteredDict = useMemo(() => {
    const result = Object.fromEntries(
      Object.entries(eventDict).filter((eventRecord) => {
        const event = eventRecord[1];

        // tag filter
        const eventTags = event.tags ?? [];
        const tagMatch = tagFilter.selected.some((tag) =>
          eventTags.includes(tag)
        );
        const isUntagged = eventTags.length === 0;

        // status filter
        const statusMatch = selectedStatuses.includes(
          event.timeCategory ?? "unknown"
        );

        if (!statusMatch) return false;
        if (isUntagged) return tagFilter.includeUntagged;
        return tagMatch;
      })
    );

    return result;
  }, [eventDict, tagFilter, selectedStatuses]);

  // update the store with the filtered items
  useEffect(() => {
    setFilteredItems(filteredDict);
  }, [filteredDict, setFilteredItems]);

  // whenever filteredData changes, regenerate the GeoJSON
  useEffect(() => {
    log("filteredData has changed. updating!");
    if (!mapRef.current || !mapRef.current.getSource("events")) return;

    const source = mapRef.current.getSource("events") as mapboxgl.GeoJSONSource;

    const geoJsonData: FeatureCollection<Point, GeoJsonProperties> = {
      type: "FeatureCollection",
      features: Object.values(filteredDict).map((event) => ({
        type: "Feature",
        id: event.id,
        geometry: {
          type: "Point",
          coordinates: [event.location_long, event.location_lat],
        },
        properties: {
          id: event.id,
          name: event.name,
        },
      })),
    };

    source.setData(geoJsonData);
  }, [filteredDict, tagFilterIsActive, statusFilterIsActive]);

  // here's where the markers are rendered
  //
  useEffect(() => {
    log("dict-map", eventDict, mapRef.current);
    if (!mapRef.current || !eventDict || Object.keys(eventDict).length === 0)
      return;

    log("selectedTags", tagFilter.selected);

    addMarkersToMap(
      mapRef.current!,
      filteredDict,
      setSelectedCon,
      setSelectedClusterId,
      setSidebarMode,
      setFocusedEvents
    );
  }, [
    filteredDict,
    eventDict,
    tagFilter,
    setFocusedEvents,
    setSelectedCon,
    setSelectedClusterId,
    setSidebarMode,
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
        .setLngLat([selectedCon.location_long, selectedCon.location_lat])
        .addTo(mapRef.current);
      return () => {
        if (marker) marker.remove();
      };
    }
  }, [selectedCon]);

  // render the temp pins
  useEffect(() => {
    if (!mapRef.current || tempPinCons.length === 0) return;

    const markers: mapboxgl.Marker[] = [];

    tempPinCons.forEach((con) => {
      const marker = new mapboxgl.Marker({
        color: "#FFA726",
        offset: [0, -20],
      })
        .setLngLat([con.location_long, con.location_lat])
        .addTo(mapRef.current!);

      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [tempPinCons]);

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
