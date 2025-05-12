import { DateRangeInput } from "@/components/edit-modal/editor-helpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewYearInfoFields } from "@/types/suggestion-types";
import { parseISO } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function YearEdit({
  yearData,
  onChange,
  onDelete,
  isNew = false,
}: {
  yearData: NewYearInfoFields;
  onChange: (updated: NewYearInfoFields) => void;
  onDelete?: () => void;
  isNew?: boolean;
}) {
  //
  // 1: event status
  //   const [eventStatus, setEventStatus] = useState<ConStatus>(
  //     yearData.event_status
  //   );
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
  // 4: google link
  //   const [gLink, setGLink] = useState(yearData.g_link ?? "");
  //
  // 5: venue
  const [venue, setVenue] = useState(yearData.venue ?? "");
  //
  // 6: location
  const [location, setLocation] = useState(yearData.location ?? "");

  return (
    <div className="border border-primary rounded-md p-4 bg-primary-lightest flex flex-col gap-6">
      {yearData.is_new_year && <Input placeholder="hey" />}

      <div className="flex flex-col">
        <DateRangeInput
          label="Event Dates"
          value={dateRange}
          onChange={setDateRange}
          placeholder="Select the date range for this year's event"
          encouragement="Looks good!"
        />
      </div>

      <div className="grid grid-cols-[72px_1fr] items-center gap-2">
        <Label>Venue:</Label>
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
        <Label>Location:</Label>
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

      {onDelete && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onDelete}
            className="text-xs text-destructive hover:underline"
          >
            Delete {isNew ? "Draft" : "Year"}
          </button>
        </div>
      )}

      <button
        onClick={() => {
          onChange({
            ...yearData,
            start_date: dateRange?.from
              ? dateRange.from.toISOString().split("T")[0]
              : "",
            end_date: dateRange?.to
              ? dateRange.to.toISOString().split("T")[0]
              : null,
          });
        }}
        className="text-sm border-2 border-primary px-3 py-1 bg-primary text-text-primary rounded-md
        cursor-pointer hover:bg-primary-light w-fit self-end"
      >
        Save Year
      </button>
    </div>
  );
}
