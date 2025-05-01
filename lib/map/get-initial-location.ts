import { DEFAULT_LOCATION } from "@/lib/constants";
import { ConLocation } from "@/types/con-types";
import { log } from "../utils";

export async function getInitialLocation(): Promise<ConLocation> {

  // try getting location from IP address
  try {
    const res = await fetch("https://ipapi.co/json");
    const data = await res.json();
    console.log("Trying to IP address loc", data);
    return { latitude: data.latitude, longitude: data.longitude };
  } catch {
    // if it doesn't work, just default to showing SF lol
    return DEFAULT_LOCATION;
  }
}

export const getBrowserLocation = async (): Promise<ConLocation | null> => {
  return new Promise<ConLocation | null>((resolve) => {
    if (!navigator.geolocation) return resolve(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({latitude: pos.coords.latitude, longitude: pos.coords.longitude}),
      () => resolve(null),
      { timeout: 5000 }
    );
  });

};
