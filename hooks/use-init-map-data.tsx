import getInitialLocation from "@/lib/map/get-initial-location";
import { useEventStore } from "@/stores/all-events-store";
import {
  useMapCardsStore,
  useSidebarStore,
} from "@/stores/explore-sidebar-store";
import { useMapStore } from "@/stores/map-store";
import { ConLocation } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// initialization steps:
// 1: get initial coordinates to center the map
// 2: load all events in the background
// TODO memoize events inside useEffect
export default function useInitMapData() {
  const [initLocation, setInitLocation] = useState<ConLocation | null>(null);
  const [initialized, setInitialized] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const init = async () => {
      const coords = await getInitialLocation();
      if (coords) setInitLocation(coords);
      useMapStore.getState().setUserLocation(coords); //save coords to map

      await useEventStore.getState().fetchAllEvents();

      // if user types in /explore?conId=123 then init map to convention 123
      const con = searchParams.get("con");
      if (con) {
        const conId = useEventStore.getState().slugToId[con];
        const match = useEventStore.getState().allEvents[conId];

        if (match) {
          useMapCardsStore.getState().setFocusedEvents([match]);
          useSidebarStore.getState().setSelectedCon(match);
          setInitLocation({
            latitude: match.location_lat,
            longitude: match.location_long,
          });
        }
      }

      setInitialized(true);

      // things ok to do after initialization
      useSidebarStore.getState().setInitialized(); // just so ?conId doesn't break
    };

    init();
  }, []);

  return { initLocation, initialized };
}
