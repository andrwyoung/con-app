// add all the event markers to the map
// very messy file....sorry

import {
  SidebarMode,
  useExploreSelectedCardsStore,
  useSidebarStore,
} from "@/stores/sidebar-store";
import { useMapStore } from "@/stores/map-store";
import { ConventionInfo } from "@/types/types";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { DataDrivenPropertyValueSpecification } from "mapbox-gl";
import { MAX_SEARCH_BATCH_SIZE } from "../constants";
import { isPointTooCloseToEdge } from "./map-helpers";

export default function addMarkersToMap(
  map: mapboxgl.Map,
  filteredDict: Record<string, ConventionInfo>,
  setSelectedCon: (c: ConventionInfo | null) => void,
  setSelectedClusterId: (id: number | null) => void,
  setSidebarMode: (mode: SidebarMode) => void,
  setFocusedEvents: (e: ConventionInfo[]) => void
) {
  let hoveredPointId: string | number | null = null;
  let hoveredClusterId: number | null = null;

  console.log("dict-marker", filteredDict);
  const events = Object?.values(filteredDict);

  // SECTION: Constants
  //
  //

  const POINT_COLOR = "#FFD79E";
  const HOVER_COLOR = "#EDAE77";
  // const OUTLINE_COLOR = "#CF803B";
  const TRANSITION_TIME = 300;

  const POINT_SIZE = 10;

  const CLUSTER_STEP = [
    "step",
    ["get", "point_count"],
    15,
    10,
    20,
    50,
    25,
  ] as DataDrivenPropertyValueSpecification<number>;
  const CLUSTER_HOVER_STEP = [
    "step",
    ["get", "point_count"],
    17,
    10,
    22,
    50,
    27,
  ] as DataDrivenPropertyValueSpecification<number>;

  // SECTION: Initialize Map
  //
  //

  map.on("load", () => {
    console.log("events length?", events.length);

    // this is where we destructure all our events into mapbox's syntax
    const geoJsonData: FeatureCollection<Point, GeoJsonProperties> = {
      type: "FeatureCollection",
      features: events.map((event) => ({
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

    console.log("GeoJSON length:", geoJsonData.features.length);
    if (map.getSource("events")) {
      // if "events" already exists, don't recreate it. rather just update it
      (map.getSource("events") as mapboxgl.GeoJSONSource).setData(geoJsonData);
    } else {
      // but if "events" doesn't exist, then create em
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
          "circle-color": POINT_COLOR,
          "circle-radius": CLUSTER_STEP,
        },
      });
      map.addLayer({
        id: "clusters-hover",
        type: "circle",
        source: "events",
        filter: ["==", ["get", "cluster_id"], -1], // default: nothing hovered
        paint: {
          "circle-color": HOVER_COLOR,
          "circle-radius": CLUSTER_HOVER_STEP,
          "circle-color-transition": {
            duration: TRANSITION_TIME,
          },
          "circle-radius-transition": {
            duration: TRANSITION_TIME,
          },
        },
      });
      map.addLayer({
        id: "clusters-clicked",
        type: "circle",
        source: "events",
        filter: ["==", ["get", "cluster_id"], -1], // default: nothing clicked
        paint: {
          "circle-color": HOVER_COLOR, // or something distinct from hover
          "circle-radius": CLUSTER_STEP, // slightly larger for emphasis
          "circle-color-transition": {
            duration: TRANSITION_TIME,
          },
          "circle-radius-transition": {
            duration: TRANSITION_TIME,
          },
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
          "circle-color": POINT_COLOR,
          "circle-radius": POINT_SIZE,
        },
      });
      map.addLayer({
        id: "unclustered-point-hover",
        type: "circle",
        source: "events",
        filter: ["==", ["get", "id"], ""], // default: nothing hovered
        paint: {
          "circle-color": HOVER_COLOR,
          "circle-radius": POINT_SIZE,
          "circle-color-transition": {
            duration: TRANSITION_TIME,
          },
          "circle-radius-transition": {
            duration: TRANSITION_TIME,
          },
        },
      });
      map.addLayer({
        id: "unclustered-point-clicked",
        type: "circle",
        source: "events",
        filter: ["==", ["get", "id"], ""], // no point selected initially
        paint: {
          "circle-color": HOVER_COLOR,
          "circle-radius": POINT_SIZE,
          // "circle-stroke-color": OUTLINE_COLOR,
          // "circle-stroke-width": 2,
          "circle-color-transition": {
            duration: TRANSITION_TIME,
          },
          "circle-radius-transition": {
            duration: TRANSITION_TIME,
          },
        },
      });
    }

    // SECTION: reusable functions (put in store)
    //
    //

    const clearSelectedPointHighlight = () => {
      map.setFilter("unclustered-point-clicked", ["==", ["get", "id"], ""]);
    };
    useMapStore
      .getState()
      .setClearSelectedPointHighlight(clearSelectedPointHighlight);

    const highlightPointOnMap = (id: string | number) => {
      map.setFilter("unclustered-point-clicked", ["==", ["get", "id"], id]);
      clearClickedClusterHighlight();
    };
    useMapStore.getState().setHighlightPointOnMap(highlightPointOnMap);

    const clearClickedClusterHighlight = () => {
      setSelectedClusterId(null);
      map.setFilter("clusters-clicked", ["==", ["get", "cluster_id"], -1]);
    };
    useMapStore
      .getState()
      .setClearClickedClusterHighlight(clearClickedClusterHighlight);

    // SECTION: Hovering Behavior
    //
    //

    map.on("mousemove", "unclustered-point", (e) => {
      map.getCanvas().style.cursor = "pointer";

      if (e.features?.length) {
        hoveredPointId = e.features[0].properties?.id;
        if (
          typeof hoveredPointId === "string" ||
          typeof hoveredPointId === "number"
        ) {
          map.setFilter("unclustered-point-hover", [
            "==",
            ["get", "id"],
            hoveredPointId,
          ]);
        }
      }
      map.setPaintProperty(
        "unclustered-point-hover",
        "circle-color",
        HOVER_COLOR
      );
      map.setPaintProperty(
        "unclustered-point-hover",
        "circle-radius",
        POINT_SIZE + 2
      );
    });

    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "default";
      map.setFilter("unclustered-point-hover", ["==", ["get", "id"], ""]);
      hoveredPointId = null;

      map.setPaintProperty(
        "unclustered-point-hover",
        "circle-color",
        POINT_COLOR
      );
      map.setPaintProperty(
        "unclustered-point-hover",
        "circle-radius",
        POINT_SIZE
      );
    });

    // Cluster Hovering

    map.on("mousemove", "clusters", (e) => {
      map.getCanvas().style.cursor = "pointer";

      if (e.features?.length) {
        const clusterId = e.features[0].properties?.cluster_id;

        if (clusterId !== undefined && clusterId !== hoveredClusterId) {
          hoveredClusterId = clusterId;

          map.setFilter("clusters-hover", [
            "==",
            ["get", "cluster_id"],
            hoveredClusterId,
          ]);
        }
      }
      map.setPaintProperty("clusters-hover", "circle-color", HOVER_COLOR);
      map.setPaintProperty(
        "clusters-hover",
        "circle-radius",
        CLUSTER_HOVER_STEP
      );
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "default";
      hoveredClusterId = null;
      map.setFilter("clusters-hover", ["==", ["get", "cluster_id"], -1]);
      map.setPaintProperty("clusters-hover", "circle-color", POINT_COLOR);
      map.setPaintProperty("clusters-hover", "circle-radius", CLUSTER_STEP);
    });

    // SECTION: Clicking Behavior
    //
    //

    // clicking a single point
    map.on("click", "unclustered-point", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["unclustered-point"],
      });

      if (!features.length) return;

      const props = features[0].properties;
      const point = features[0].geometry as GeoJSON.Point;
      const clickedId = props?.id;

      if (clickedId) {
        const selectedCon = useExploreSelectedCardsStore.getState().selectedCon;
        if (!selectedCon || selectedCon.id !== clickedId) {
          // highlight point
          highlightPointOnMap(clickedId);

          // pan to it if user preference allows
          const coords = point.coordinates as [number, number];
          if (isPointTooCloseToEdge(map, coords)) {
            map.easeTo({
              center: coords,
              speed: 0.5,
              duration: 900,
            });
          }

          console.log("Convention clicked:", props);
          // KEY LINE: here's where we give the info to sidebar
          setSidebarMode("filter");
          setFocusedEvents([filteredDict[clickedId]]);
          setSelectedCon(filteredDict[clickedId]);
        } else {
          // if reselecting the same point then deselect
          clearSelectedPointHighlight();
          setSelectedCon(null); // deselect also on sidebar
        }
      }
    });

    // clicking a cluster
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });

      const clusterId = features[0].properties?.cluster_id;
      const source = map.getSource("events") as mapboxgl.GeoJSONSource;
      if (!clusterId || !source) return;

      // first center the point
      const point = features[0].geometry as GeoJSON.Point;
      const coords = point.coordinates as [number, number];
      if (isPointTooCloseToEdge(map, coords)) {
        map.easeTo({
          center: coords,
          speed: 0.5,
          duration: 900,
        });
      }

      // clear any clicked currently clicked points
      clearSelectedPointHighlight();

      const selectedClusterId = useSidebarStore.getState().selectedClusterId;
      if (selectedClusterId !== clusterId) {
        // highlight clicked cluster on mapbox
        map.setFilter("clusters-clicked", [
          "==",
          ["get", "cluster_id"],
          clusterId,
        ]);

        // then, get all the individual points in that cluster
        source.getClusterLeaves(
          clusterId,
          MAX_SEARCH_BATCH_SIZE,
          0,
          (err, leaves) => {
            if (err) {
              console.error("Failed to get cluster leaves", err);
              return;
            }

            const conList =
              leaves?.map((f) => f.properties?.id).filter(Boolean) ?? [];
            console.log("Cluster contains:", conList);

            const fullCons = conList
              .map((id) => filteredDict[id])
              .filter((c): c is ConventionInfo => !!c);

            // KEY LINE: here's where we return all the cluster points back to sidebar
            console.log("EventInfo: ", fullCons);
            setFocusedEvents(fullCons);
          }
        );

        // let sidebar mode know what's up
        setSelectedClusterId(clusterId);
        setSidebarMode("filter");
      } else {
        setSelectedClusterId(null);
        setFocusedEvents([]);
        clearClickedClusterHighlight();
      }
      // setSelectedCon(null);
    });

    map.on("click", (e) => {
      const { point } = e;

      // optional: skip clicks on features (like markers or clusters)
      // const features = map.queryRenderedFeatures(e.point);
      // if (features.length > 0) return;

      // create ripple
      const ripple = document.createElement("div");
      ripple.className = "map-pulse";
      ripple.style.left = `${point.x - 12}px`; // center it
      ripple.style.top = `${point.y - 12}px`; // center it

      // add to map container
      const mapCanvas = map.getCanvasContainer();
      ripple.style.position = "absolute";
      ripple.style.zIndex = "999";

      mapCanvas.appendChild(ripple);

      // remove it after animation
      setTimeout(() => {
        ripple.remove();
      }, 400);
    });
  });
}
