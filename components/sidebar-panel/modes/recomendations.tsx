import { useMapStore } from "@/stores/map-store";
import CardList from "../../card/card-list/card-list";
import { useEventStore } from "@/stores/all-events-store";
import { useMemo } from "react";
import { getDistance } from "@/lib/utils";
import { getStartDate } from "@/lib/helpers/sort-cons";
import { motion } from "framer-motion";
import { Scope } from "@/types/con-types";

export default function Recommendations({ scope }: { scope: Scope }) {
  const userLocation = useMapStore((s) => s.userLocation);
  const allCons = useEventStore((s) => s.allEvents);

  const recommended = useMemo(() => {
    if (!userLocation) return [];

    return (
      Object.values(allCons)
        // step 1: filter for valid conventions (not passed)
        .filter((con) => {
          const hasCoords =
            typeof con.location_lat === "number" &&
            typeof con.location_long === "number";

          const startDate = getStartDate(con);

          return hasCoords && startDate && startDate > new Date();
        })

        //step 2: add distance
        .map((con) => ({
          ...con,
          distance: getDistance(
            [userLocation.latitude, userLocation.longitude],
            [con.location_lat, con.location_long]
          ),
        }))

        // step 3: sort by distance
        .sort((a, b) => a.distance - b.distance)

        // step 4: take the top 5
        .slice(0, 5)

        // step 5: sort those by date
        .sort((a, b) => getStartDate(a).getTime() - getStartDate(b).getTime())
    );
  }, [userLocation, allCons]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-y-scroll scrollbar-none flex flex-col gap-2 w-full"
    >
      <p className="text-xs text-primary-muted italic">
        Based on your location and recent activity
      </p>
      <CardList items={recommended} type="recommendation" scope={scope} />
    </motion.div>
  );
}
