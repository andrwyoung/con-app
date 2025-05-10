import { useMapStore } from "@/stores/map-store";
import CardList from "../../card/card-list/card-list";
import { useEventStore } from "@/stores/all-events-store";
import { useMemo } from "react";
import { getDistance } from "@/lib/utils";
import { motion } from "framer-motion";
import { Scope } from "@/types/con-types";

const NUM_OF_RECS = 50;

function interleave<T>(
  primary: T[],
  secondary: T[],
  ratioRange = [2, 5],
  expectedChunkRange = [1, 2]
): T[] {
  const result: T[] = [];
  let p = 0,
    s = 0;

  while (p < primary.length || s < secondary.length) {
    const ratio = Math.floor(
      Math.random() * (ratioRange[1] - ratioRange[0] + 1) + ratioRange[0]
    );

    for (let i = 0; i < ratio && p < primary.length; i++) {
      result.push(primary[p++]);
    }

    const chunkSize = Math.floor(
      Math.random() * (expectedChunkRange[1] - expectedChunkRange[0] + 1) +
        expectedChunkRange[0]
    );

    for (let j = 0; j < chunkSize && s < secondary.length; j++) {
      result.push(secondary[s++]);
    }
  }

  return result;
}

export default function Recommendations({ scope }: { scope: Scope }) {
  const userLocation = useMapStore((s) => s.userLocation);
  const allCons = useEventStore((s) => s.allEvents);

  // const recommendedV1 = useMemo(() => {
  //   if (!userLocation) return [];

  //   return (
  //     Object.values(allCons)
  //       // step 1: filter for valid conventions (not passed)
  //       .filter((con) => {
  //         const hasCoords =
  //           typeof con.location_lat === "number" &&
  //           typeof con.location_long === "number";

  //         const startDate = getStartDate(con);

  //         return hasCoords && startDate && startDate > new Date();
  //       })

  //       //step 2: add distance
  //       .map((con) => ({
  //         ...con,
  //         distance: getDistance(
  //           [userLocation.latitude, userLocation.longitude],
  //           [con.location_lat, con.location_long]
  //         ),
  //       }))

  //       // step 3: sort by distance
  //       .sort((a, b) => a.distance - b.distance)

  //       // step 4: take the top 5
  //       .slice(0, NUM_OF_RECS)

  //       // step 5: sort those by date
  //       .sort((a, b) => getStartDate(a).getTime() - getStartDate(b).getTime())
  //   );
  // }, [userLocation, allCons]);

  const recommendedV2 = useMemo(() => {
    if (!userLocation) return [];

    const all = Object.values(allCons).filter((con) => {
      const hasCoords =
        typeof con.location_lat === "number" &&
        typeof con.location_long === "number";
      return hasCoords;
    });

    const withStatus = all.map((con) => {
      const status = con.aaStatus;
      const distance = getDistance(
        [userLocation.latitude, userLocation.longitude],
        [con.location_lat, con.location_long]
      );

      return { ...con, distance, status };
    });

    // Get all open or announced
    const openOrAnnounced = withStatus
      .filter(
        (c) =>
          c.status === "open" ||
          c.status === "announced" ||
          c.status === "watch_link"
      )
      .sort((a, b) => a.distance - b.distance);

    // If we have fewer than 25, fill with "expected"
    if (openOrAnnounced.length >= NUM_OF_RECS) {
      return openOrAnnounced.slice(0, NUM_OF_RECS);
    }

    const expected = withStatus
      .filter((c) => c.status === "expected")
      .sort(() => Math.random() - 0.5);

    const combined = interleave(openOrAnnounced, expected).slice(
      0,
      NUM_OF_RECS
    );

    return combined;
  }, [userLocation, allCons]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-y-scroll scrollbar-none flex flex-col gap-2 w-full"
    >
      {/* <p className="text-xs text-primary-muted italic">Open applications</p> */}
      <CardList items={recommendedV2} type="recommendation" scope={scope} />
    </motion.div>
  );
}
