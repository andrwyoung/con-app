// I added a cool feature on the minimap to let people search google to get
// the latitude and longitude for an event. This is the file that actually searches google for it

import axios from "axios";
import { log } from "../utils";

export async function fetchLatLong(
  location: string
): Promise<{ lat: number; lng: number; formatted_address: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // or use a secure env var
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    location
  )}&key=${apiKey}`;

  log("google maps. searching: ", location);

  try {
    const res = await axios.get(url);
    const result = res.data.results[0];
    if (!result) return null;

    const { lat, lng } = result.geometry.location;
    const { formatted_address } = result;

    log("success! : ", lat, " ", lng);

    return { lat, lng, formatted_address };
  } catch (err) {
    console.error("Geocoding failed:", err);
    return null;
  }
}
