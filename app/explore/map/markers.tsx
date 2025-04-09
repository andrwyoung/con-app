// add all the event markers to the map
import { EventInfo } from "@/types/types";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";

export default function addMarkersToMap(
  map: mapboxgl.Map,
  events: EventInfo[]
) {
  let hoveredId: string | number | null = null;

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
          id: event.id,
          name: event.name,
          date: event.date,
          fancons_link: event.url,
        },
      })),
    };

    console.log("GeoJSON length:", geoJsonData.features.length);
    if (map.getSource("events")) {
      // if "events" already exists, don't recreate it. rather just update it
      (map.getSource("events") as mapboxgl.GeoJSONSource).setData(geoJsonData);
    } else {
      // but if "events" doesn't exist, then create
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
          "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 50, 25],
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
          "circle-color": "#FFD79E",
          "circle-radius": 6,
        },
      });
      map.addLayer({
        id: "unclustered-point-hover",
        type: "circle",
        source: "events",
        filter: ["==", ["get", "id"], ""], // empty until hover
        paint: {
          "circle-color": "#EDAE77", // e.g. orange-500
          "circle-radius": 7,
          "circle-stroke-color": "#000",
          // "circle-stroke-width": 1,
          "circle-radius-transition": { duration: 200 },
          "circle-color-transition": { duration: 200 },
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
    }

    map.on("mousemove", "unclustered-point", (e) => {
      map.getCanvas().style.cursor = "pointer";

      if (e.features?.length) {
        hoveredId = e.features[0].properties?.id;
        map.setFilter("unclustered-point-hover", [
          "==",
          ["get", "id"],
          hoveredId,
        ]);
      }
    });

    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "";
      hoveredId = null;
      map.setFilter("unclustered-point-hover", ["==", ["get", "id"], ""]);
    });
  });
}
