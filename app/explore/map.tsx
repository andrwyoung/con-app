import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { FeatureCollection, GeoJsonProperties, Point } from "geojson";

import "mapbox-gl/dist/mapbox-gl.css";
import { EventInfo } from "@/types/types";
import { supabaseAnon } from "@/lib/supabase/client";

// different colored maps
// const mapStyles = [
//   { id: "dataviz-light", name: "Monochrome" },
//   { id: "bright", name: "Classic" },
//   { id: "basic", name: "Greener" },
// ];

export default function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [events, setEvents] = useState<EventInfo[]>([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  // initial mount of map
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

    // create the map
    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/andrwyoung/cm93lxid4003c01rihwc1844d",
      center: [-122.4194, 37.7749],
      zoom: 8,
    });

    // grab every single convention in our datbase
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabaseAnon
          .from("full_convention_table")
          .select("*");

        console.log(data);
        if (error) throw error;
        setEvents(data ?? []);
        setEventsLoaded(true);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();

    new mapboxgl.Marker()
      .setLngLat([12.554729, 55.70651])
      .addTo(mapRef.current);

    new mapboxgl.Marker({ color: "black", rotation: 45 })
      .setLngLat([12.65147, 55.608166])
      .addTo(mapRef.current);

    return () => mapRef.current?.remove();
  }, []);

  // render all the markers once fetched
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (eventsLoaded) {
      map.on("load", () => {
        console.log("events length?", events.length);

        const geoJsonData: FeatureCollection<Point, GeoJsonProperties> = {
          type: "FeatureCollection",
          features: events.map((event) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [event.longitude, event.latitude],
            },
            properties: {
              name: event.name,
              date: event.date,
              fancons_link: event.url,
            },
          })),
        };

        console.log("hey!", events.length, geoJsonData);
        console.log("GeoJSON length:", geoJsonData.features.length);
        map.addSource("events", {
          type: "geojson",
          data: geoJsonData,
          cluster: true,
          clusterRadius: 50,
          clusterMaxZoom: 14,
        });

        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "events",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#FFD79E",
            "circle-radius": [
              "step",
              ["get", "point_count"],
              15,
              10,
              20,
              50,
              25,
            ],
          },
        });

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "events",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });
        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "events",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#11b4da",
            "circle-radius": 6,
          },
        });

        // OLD marker logic
        // if (events.length) {
        //   events.map((event) => {
        //     new mapboxgl.Marker()
        //       .setLngLat([event.longitude, event.latitude])
        //       .addTo(mapRef.current!);
        //   });
        // }

        // DEBUG layer
        // map.addLayer({
        //   id: "debug-points",
        //   type: "circle",
        //   source: "events",
        //   paint: {
        //     "circle-color": "#ff0000",
        //     "circle-radius": 4,
        //   },
        // });
      });
    }
  }, [eventsLoaded]);

  return <div id="map" ref={mapContainerRef} style={{ height: "100%" }}></div>;
}
