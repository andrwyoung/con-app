import { DEFAULT_LOCATION } from "@/lib/constants";
import { ConLocation } from "@/types/types";
import { log } from "../utils";

export default async function getInitialLocation(): Promise<ConLocation> {
  // 1: try browser GPS 
  // DEPRECATED to increase trust

  // const browserLoc = await new Promise<ConLocation | null>((resolve) => {
  //   if (!navigator.geolocation) return resolve(null);

  //   navigator.geolocation.getCurrentPosition(
  //     (pos) => resolve({latitude: pos.coords.latitude, longitude: pos.coords.longitude}),
  //     () => resolve(null),
  //     { timeout: 5000 }
  //   );
  // });
  // log("Trying to browser GPS:", browserLoc);
  // if (browserLoc) return browserLoc;

  // 2: if that doesn't work, then try getting location from IP address
  try {
    const res = await fetch("https://ipapi.co/json");
    const data = await res.json();
    log("Trying to IP address loc", data);
    return { latitude: data.latitude, longitude: data.longitude };
  } catch {
    // 3 if none of those work, just default to showing SF lol
    return DEFAULT_LOCATION;
  }
}
