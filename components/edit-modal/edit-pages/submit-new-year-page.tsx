// PAGE 1 of edit-con-modal: this is how people can add a new yaer to a convention

import React, { useState } from "react";
import { DialogFooter } from "../../ui/dialog";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { FullConventionDetails } from "@/types/con-types";
import HeadersHelper, {
  DateRangeInput,
  VenueLocationFields,
} from "../editor-helpers";
import { EditModalState } from "../edit-con-modal";
import useShakeError from "@/hooks/use-shake-error";
import { useUserStore } from "@/stores/user-store";
import { supabaseAnon } from "@/lib/supabase/client";
import {
  ArtistAlleyInfoFields,
  NewYearInfoFields,
  SuggestionsMetadataFields,
} from "@/types/suggestion-types";
import { handleSubmitWrapper } from "../handle-submit-wrapper";
import { buildInitialMetadata } from "@/lib/editing/approval-metadata";
import { CheckField } from "@/components/sidebar-panel/modes/filters/filter-helpers";
import { AnimatePresence, motion } from "framer-motion";
import { buildCompleteYearPayload } from "@/lib/editing/build-new-year";
import { pushApprovedNewYear } from "@/lib/editing/push-years";
import { VALIDATION_ERROR } from "@/lib/constants";
import MapboxMiniMap from "./con-details-pages/con-details-helpers/page-3/mini-mapbox";
import { ArtistAlleyStatus } from "@/types/artist-alley-types";
import { fetchLatLong } from "@/lib/editing/fetch-lat-long";
import { toast } from "sonner";

export default function SubmitNewYearPage({
  conDetails,
  setPage,
  setRefreshKey,
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditModalState) => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const latestYear = () => {
    return conDetails.convention_years.reduce((latest, current) =>
      current.year > latest.year ? current : latest
    );
  };

  // 1: date
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  // 2: venue
  const [venue, setVenue] = useState(latestYear().venue ?? "");
  // 3: location
  const [location, setLocation] = useState(latestYear().location ?? "");
  // 4: long/lat
  const [long, setLong] = useState(conDetails.location_long ?? undefined);
  const [lat, setLat] = useState(conDetails.location_lat ?? undefined);
  const latLongHasChanged =
    lat !== conDetails.location_lat || long !== conDetails.location_long;

  const [showLocChange, setShowLocChange] = useState(false);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { error, shake, triggerError } = useShakeError();

  const { user, profile } = useUserStore();
  const isAdmin = profile?.role === "ADMIN";

  const handleGeocode = async () => {
    const result = await fetchLatLong(`${venue}, ${location}`);
    if (result) {
      setLat(result.lat);
      setLong(result.lng);
      setFormattedAddress(result.formatted_address);
      toast.success("Found a location!");
    } else {
      toast.error("Couldn't find location via Google Maps.");
    }
  };

  const handleSubmit = async () => {
    await handleSubmitWrapper({
      setSubmitting,
      setPage,
      tryBlock: async () => {
        if (!date?.from) {
          triggerError("Please at least put a start date");
          setSubmitting(false);
          throw new Error(VALIDATION_ERROR);
        }

        const now = new Date();
        const fromDate = date.from;
        if (fromDate < new Date(now.toDateString())) {
          triggerError("Start date must be today or in the future");
          setSubmitting(false);
          throw new Error(VALIDATION_ERROR);
        }

        if (venue.trim() === "" || location.trim() === "") {
          triggerError("Please put a venue and location");
          setSubmitting(false);
          throw new Error(VALIDATION_ERROR);
        }

        const payload: NewYearInfoFields = {
          event_status: "EventScheduled",

          year: latestYear().year + 1,
          start_date: date.from.toISOString().split("T")[0] ?? "",
          end_date: date?.to?.toISOString().split("T")[0] ?? undefined,

          venue: venue.trim(),
          location: location.trim(),

          // suggestion table specific
          is_new_year: true,
        };

        const initMetadata: SuggestionsMetadataFields = buildInitialMetadata(
          user?.id ?? null
        );

        const { data: suggestionInsert, error: insertError } =
          await supabaseAnon
            .from("suggestions_new_year")
            .insert({
              convention_id: conDetails.id,
              location_lat: lat,
              location_long: long,

              ...payload,
              ...initMetadata,
            })
            .select()
            .single();
        if (insertError) throw insertError;

        if (user && isAdmin) {
          // create a new convention_year

          // grab last year's application start and end dates (keep em around)
          const latestOveride = latestYear()
            .aa_status_override as ArtistAlleyStatus;
          const aaFields: ArtistAlleyInfoFields = {
            aa_open_date: undefined,
            aa_deadline: undefined,
            aa_real_release: undefined,
            aa_link: undefined,
            aa_status_override:
              latestOveride === "invite_only" || latestOveride === "no_aa"
                ? latestOveride
                : undefined,
          };

          const newYearPacket = {
            yearInfo: buildCompleteYearPayload(payload, conDetails.id),
            suggestionId: suggestionInsert.id,
            aaInfo: aaFields,
          };

          const confirmed = confirm(`Admin: Push real changes too?`);
          if (!confirmed) return;

          // PART 1: if long/lat is different, push that first
          if (latLongHasChanged) {
            await supabaseAnon
              .from("conventions")
              .update({ location_lat: lat, location_long: long })
              .eq("id", conDetails.id);
          }

          // PART 2: add the new year + approve it
          await pushApprovedNewYear(newYearPacket, user.id);
        }

        // reset states
        setRefreshKey((prev) => prev + 1);
      },
    });
  };

  return (
    <HeadersHelper
      title="Submit New Dates"
      website={conDetails.website ?? undefined}
    >
      <div>
        <div className="flex flex-col gap-2 py-4">
          <DateRangeInput
            label="Event Dates"
            value={date}
            onChange={setDate}
            placeholder="Select event range"
          />
          <CheckField
            text="At a new location?"
            isChecked={showLocChange}
            onChange={() => setShowLocChange(!showLocChange)}
          />
          <AnimatePresence initial={false}>
            {showLocChange && (
              <motion.div
                key="yearmap"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col gap-2 overflow-hidden"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleGeocode();
                  }}
                  className="flex flex-col"
                >
                  <VenueLocationFields
                    venue={venue}
                    location={location}
                    onVenueChange={setVenue}
                    onLocationChange={setLocation}
                  />
                  <button
                    type="submit"
                    className="text-sm text-secondary-darker hover:underline cursor-pointer transition-all hover:text-secondary"
                  >
                    {formattedAddress.trim() === ""
                      ? "Try Locating Pin with Google Maps"
                      : formattedAddress}
                  </button>
                </form>
                <div className="flex flex-col gap-2">
                  {lat && long && (
                    <MapboxMiniMap
                      lat={lat}
                      long={long}
                      onUpdate={({ lat, long }) => {
                        setLat(lat);
                        setLong(long);
                      }}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <DialogFooter>
        <div className="flex flex-col gap-2 items-center">
          <Button
            onClick={handleSubmit}
            disabled={
              submitting ||
              !date ||
              venue.trim() === "" ||
              location.trim() === ""
            }
          >
            {submitting ? "Submitting..." : "Submit Update"}
          </Button>
          {error && (
            <span
              id="aa-update-error"
              className={`text-sm ${shake && "animate-shake"} text-red-500`}
            >
              {error}
            </span>
          )}
        </div>
      </DialogFooter>
    </HeadersHelper>
  );
}
