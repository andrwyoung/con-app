import { ConLocation } from "@/types/types";

export default async function getInitialLocation(): Promise<ConLocation> {
  // 1: try browser GPS
  const browserLoc = await new Promise<ConLocation | null>((resolve) => {
    if (!navigator.geolocation) return resolve(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({latitude: pos.coords.latitude, longitude: pos.coords.longitude}),
      () => resolve(null),
      { timeout: 5000 }
    );
  });
  console.log("Trying to browser GPS:", browserLoc);
  if (browserLoc) return browserLoc;

  // 2: if that doesn't work, then try getting location from IP address
  try {
    const res = await fetch("https://ipapi.co/json");
    const data = await res.json();
    console.log("Trying to IP address loc", data);
    return { latitude: data.longitude, longitude: data.latitude };
  } catch {
    // 3 if none of those work, just default to showing SF lol
    return { latitude: -122.4194, longitude: 37.7749 };
  }
}
