import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import useShakeError from "@/hooks/use-shake-error";
import { FormState } from "@/lib/editing/reducer-helper";
import { NewConState } from "@/types/editor-types";
import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "sonner";
import { DateRangeInput, VenueLocationFields } from "../editor-helpers";
import MapboxMiniMap from "../edit-pages/con-details-pages/con-details-helpers/page-3/mini-mapbox";
import { DEFAULT_LOCATION } from "@/lib/constants";
import { DateRange } from "react-day-picker";
import { fetchLatLong } from "@/lib/editing/fetch-lat-long";

export default function NewConDatesLoc({
  submitting,
  handleSubmit,
  onBack,
  state,
  setField,
}: {
  submitting: boolean;
  handleSubmit: () => void;
  onBack: () => void;
  state: FormState<NewConState>;
  setField: <K extends keyof NewConState>(
    field: K
  ) => (value: NewConState[K]) => void;
}) {
  const { error, shake, triggerError } = useShakeError();
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [formattedAddress, setFormattedAddress] = useState("");

  function handleValidate() {
    if (!state.current.start_date) {
      triggerError("Please enter at least a start date");
      return;
    }

    if (!state.current.venue || !state.current.location) {
      triggerError("Please enter a Venue and Location");
      return;
    }

    if (!state.current.latLong.lat || !state.current.latLong.long) {
      triggerError("Please put a pin down on the map");
      return;
    }

    handleSubmit();
  }

  const handleGeocode = async () => {
    const result = await fetchLatLong(
      `${state.current.venue}, ${state.current.location}`
    );
    if (result) {
      setField("latLong")({ lat: result.lat, long: result.lng });
      setFormattedAddress(result.formatted_address);
      toast.success("Found a location!");
    } else {
      toast.error("Couldn't find location via Google Maps.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 py-4">
        <DateRangeInput
          label="Event Dates"
          value={date}
          onChange={(range) => {
            setDate(range);

            if (range?.from) {
              setField("year")(range.from.getFullYear());
              setField("start_date")(range.from.toISOString().split("T")[0]);
            }

            if (range?.to) {
              setField("end_date")(range.to.toISOString().split("T")[0]);
            }
          }}
          placeholder="Select event range"
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGeocode();
          }}
          className="flex flex-col"
        >
          <VenueLocationFields
            venue={state.current.venue}
            location={state.current.location}
            onVenueChange={(v) => setField("venue")(v)}
            onLocationChange={(l) => setField("location")(l)}
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
          <MapboxMiniMap
            lat={state.current.latLong.lat ?? DEFAULT_LOCATION.latitude}
            long={state.current.latLong.long ?? DEFAULT_LOCATION.longitude}
            onUpdate={({ lat, long }) => {
              setField("latLong")({ lat, long });
            }}
          />
        </div>
      </div>

      <DialogFooter>
        <div className="flex flex-col gap-2 items-center">
          <Button
            onClick={handleValidate}
            disabled={
              submitting ||
              !date?.from ||
              !state.current.venue ||
              !state.current.location ||
              !state.current.latLong.lat ||
              !state.current.latLong.long
            }
          >
            {submitting ? "Submitting..." : "Submit New Convention"}
          </Button>
          {error && (
            <span
              id="aa-update-error"
              className={`text-sm ${shake && "animate-shake"} text-red-500`}
            >
              {error}
            </span>
          )}
          <button
            type="button"
            onClick={onBack}
            className="flex flex-row items-center opacity-40 gap-1 cursor-pointer transform-colors hover:opacity-70"
          >
            <FiArrowLeft />
            <p className="transform -translate-y-[1px]">back</p>
          </button>
        </div>
      </DialogFooter>
    </>
  );
}
