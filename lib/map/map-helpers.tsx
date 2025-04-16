import mapboxgl from "mapbox-gl";

export function isPointTooCloseToEdge(
  map: mapboxgl.Map,
  coordinates: [number, number],
  bufferRatio: number = 0.3 // % by default
): boolean {
  const screenPoint = map.project(
    new mapboxgl.LngLat(coordinates[0], coordinates[1])
  );
  const canvas = map.getCanvas();
  const width = canvas.width;
  const height = canvas.height;

  const xBuffer = width * bufferRatio;
  const yBuffer = height * bufferRatio;

  return (
    screenPoint.x < xBuffer ||
    screenPoint.x > width - xBuffer ||
    screenPoint.y < yBuffer ||
    screenPoint.y > height - yBuffer
  );
}
