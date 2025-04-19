// DEPRECATED: created for initial iteration
import { useState } from "react";
import { ConLocation, ConventionInfo } from "@/types/types";
import { supabaseAnon } from "@/lib/supabase/client";

export function useExploreEvents() {
  const [location, setLocation] = useState<ConLocation | null>(null);
  const [events, setEvents] = useState<ConventionInfo[]>([]);

  const updateLocation = async (newLocation: ConLocation) => {
    if (!newLocation?.latitude || !newLocation?.longitude) {
      console.error("Invalid location:", newLocation);
      return;
    }

    setLocation(newLocation);

    try {
      const { data, error } = await supabaseAnon
        .from("full_convention_table")
        .select("*")
        .gte("latitude", newLocation.latitude - 1)
        .lte("latitude", newLocation.latitude + 1)
        .gte("longitude", newLocation.longitude - 1)
        .lte("longitude", newLocation.longitude + 1);

      if (error) throw error;
      setEvents(data ?? []);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  return {
    location,
    events,
    updateLocation,
  };
}