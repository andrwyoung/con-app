import {
  DateRangeInput,
  FormField,
} from "@/components/edit-modal/editor-helpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useShakeError from "@/hooks/use-shake-error";
import { NukeYear } from "@/lib/editing/nuke-year";
import { useUserStore } from "@/stores/user-store";
import { CON_STATUS_LABELS, ConStatus } from "@/types/con-types";
import { NewYearInfoFields } from "@/types/suggestion-types";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export default function YearEdit({
  yearData,
  onChange,
  onDelete,
  conId,
}: {
  yearData: NewYearInfoFields;
  onChange: (updated: NewYearInfoFields) => void;
  onDelete: () => void;
  conId: number;
}) {
  const { error, shake, setError, triggerError } = useShakeError();
  const [saved, setSaved] = useState(false);
  const { user, profile } = useUserStore();

  //
  // 2, 3: start and end range
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    yearData.start_date
      ? {
          from: parseISO(yearData.start_date),
          to: yearData.end_date ? parseISO(yearData.end_date) : undefined,
        }
      : undefined
  );
  //
  // 5: venue
  const [venue, setVenue] = useState(yearData.venue ?? "");
  //
  // 6: location
  const [location, setLocation] = useState(yearData.location ?? "");

  // 7: event status
  const [eventStatus, setEventStatus] = useState<ConStatus>(
    yearData.event_status
  );

  function handleSaveYear() {
    // "date and location are a must"
    if (!dateRange?.from || !venue || !location) {
      triggerError("Please fill out all fields");
      return;
    }

    // "date must actually be in that year lol"
    const fromYear = dateRange.from.getFullYear();
    const toYear = dateRange.to?.getFullYear();
    const selectedYear = yearData.year;

    if (fromYear !== selectedYear && toYear !== selectedYear) {
      triggerError(`Dates should be in ${selectedYear}`);
      return;
    }

    setError("");
    setSaved(true);

    onChange({
      ...yearData,
      venue,
      location,
      event_status: eventStatus,
      start_date: dateRange.from.toISOString(),
      end_date: dateRange.to?.toISOString() ?? null,
    });
  }

  useEffect(() => {
    setSaved(false);
  }, [venue, location, eventStatus, dateRange]);

  return (
    <div className="border border-primary rounded-md p-4 bg-primary-lightest flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {yearData.is_new_year && (
          <div className="flex flex-row justify-between">
            <div className="text-sm text-primary-text font-bold">
              Adding {yearData.year}
            </div>

            <button
              onClick={onDelete}
              className="text-xs text-rose-500 hover:text-rose-400 cursor-pointer hover:underline"
            >
              Delete New Year
            </button>
          </div>
        )}

        <DateRangeInput
          label="Event Dates:"
          value={dateRange}
          onChange={setDateRange}
          placeholder="Select the date range for this year's event"
          encouragement="Looks good!"
        />
      </div>

      <div className="grid grid-cols-[72px_1fr] items-center gap-x-4 gap-y-2">
        <Label>
          <span className="text-red-500">*</span>Venue:
        </Label>
        <Input
          placeholder="e.g. Seattle Convention Center"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.currentTarget.blur();
            }
          }}
        />
        <Label>
          <span className="text-red-500">*</span>Location:
        </Label>
        <Input
          placeholder="e.g. Seattle, WA, USA"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.currentTarget.blur();
            }
          }}
        />
      </div>

      <div className="flex flex-row justify-between">
        <FormField label="Convention Status:">
          <Select
            value={eventStatus}
            onValueChange={(e) => setEventStatus(e as ConStatus)}
          >
            <SelectTrigger className="text-primary-text bg-white border rounded-lg px-2 py-2 shadow-xs w-fit">
              <SelectValue placeholder="Select Convention Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CON_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="flex flex-col justify-end items-end">
          <button
            onClick={handleSaveYear}
            className="text-sm border-2 border-primary px-3 py-1 bg-primary text-text-primary rounded-md
          cursor-pointer hover:bg-primary-light w-fit self-end"
          >
            {saved ? "✓ Draft Ready" : "Save This Year"}
          </button>
          {error && (
            <span
              id="aa-update-error"
              className={`text-sm text-right ${
                shake && "animate-shake"
              } text-red-500 max-w-64 text-center`}
            >
              {error}
            </span>
          )}
        </div>
      </div>

      {profile?.role === "ADMIN" && !yearData.is_new_year && (
        <button
          type="submit"
          className="text-rose-500 transition-all outline-2 outline-rose-300 hover:outline-rose-400 hover:bg-rose-200 
              px-3 py-1 rounded-lg cursor-pointer text-xs mt-2 w-fit self-center bg-rose-50"
          onClick={async () => {
            const confirmed = confirm(
              `Are you sure you want to wipe all info for ${yearData.year} (including AA)?`
            );
            if (!confirmed) return;

            if (yearData.convention_year_id && user?.id) {
              await NukeYear(yearData.convention_year_id, conId, user.id);
            }
            onDelete();
          }}
        >
          Admin: Delete {yearData.year}
        </button>
      )}
    </div>
  );
}
