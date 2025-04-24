import React, { useState } from "react";
import { DialogFooter } from "../../../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullConventionDetails } from "@/types/types";
import HeadersHelper from "../editor-helpers";
import { EditorSteps } from "../edit-con-modal";

export default function UpdateDatesPage({
  conDetails,
  setPage,
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditorSteps) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);

    setSubmitting(false);

    setDate(undefined);
    setPage("confirmation");
  };

  return (
    <HeadersHelper
      title="Submit New Dates"
      description={
        conDetails.website ? (
          <>
            Website on file:{" "}
            <a
              href={conDetails.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-text underline hover:text-primary-darker"
            >
              {conDetails.website}
            </a>
          </>
        ) : undefined
      }
    >
      <div>
        <div className="flex flex-col gap-2 py-4">
          {/* <Label className="text-md text-primary-text">
        Submit New Dates:
      </Label> */}
          <Popover>
            <PopoverTrigger
              className={`
              "min-w-128 flex flex-row justify-between items-baseline text-left font-normal cursor-pointer
              border rounded-lg px-4 py-2 gap-4
              ${!date && "text-muted-foreground"}
            `}
            >
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "MMM d")} – {format(date.to, "MMM d")}
                  </>
                ) : (
                  format(date.from, "MMM d")
                )
              ) : (
                <span>Pick a date range</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={(range) => {
                  if (
                    range?.from &&
                    range?.to &&
                    range.from.getTime() === range.to.getTime()
                  ) {
                    setDate(undefined);
                  } else {
                    setDate(range);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* {profile ? (
      <Label className="text-md text-primary-text">Date Range:</Label>
    ) : (
      <h1>Log in to Edit more</h1>
    )} */}
      </div>
      <DialogFooter>
        <Button onClick={handleSubmit} disabled={submitting || !date}>
          {submitting ? "Submitting..." : "Submit Update"}
        </Button>
      </DialogFooter>
    </HeadersHelper>
  );
}
