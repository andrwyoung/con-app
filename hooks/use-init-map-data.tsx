import {getInitialLocation} from "@/lib/map/get-initial-location";
import { log } from "@/lib/utils";
import { useEventStore } from "@/stores/all-events-store";
import { useMapStore } from "@/stores/map-store";
import {
  useExploreSelectedCardsStore,
  useExploreSidebarStore,
} from "@/stores/page-store";
import { ConLocation } from "@/types/con-types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// initialization steps:
// 1: get initial coordinates to center the map
// 2: load all events in the background
export default function useInitMapData() {
  const [initLocation, setInitLocation] = useState<ConLocation | null>(null);
  const [initialized, setInitialized] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const init = async () => {
      const start = performance.now();

      await useEventStore.getState().fetchAllEvents();

      const coords = await getInitialLocation();
      if (coords) setInitLocation(coords);
      useMapStore.getState().setUserLocation(coords); //save coords to map

      // if user types in /explore?conId=123 then init map to convention 123
      const con = searchParams.get("con");
      if (con) {
        const conId = useEventStore.getState().slugToId[con];
        const match = useEventStore.getState().allEvents[conId];

        if (match) {
          useExploreSelectedCardsStore.getState().setFocusedEvents([match]);
          useExploreSelectedCardsStore.getState().setSelectedCon(match);
          setInitLocation({
            latitude: match.location_lat,
            longitude: match.location_long,
          });
        }
      }

      setInitialized(true);

      const end = performance.now();
      log(`useInitMapData finished in ${Math.round(end - start)}ms`);
    };

    init();
  }, []);

  return { initLocation, initialized };
}
