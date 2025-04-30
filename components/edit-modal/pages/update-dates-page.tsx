import React, { useState } from "react";
import { DialogFooter } from "../../ui/dialog";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { FullConventionDetails } from "@/types/con-types";
import HeadersHelper, { DateRangeInput } from "../editor-helpers";
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
      website={conDetails.website ?? undefined}
    >
      <div>
        <div className="flex flex-col gap-2 py-4">
          <div className="flex flex-col gap-2 py-4">
            <DateRangeInput
              label="Event Dates"
              value={date}
              onChange={setDate}
              placeholder="Select event range"
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSubmit} disabled={submitting || !date}>
          {submitting ? "Submitting..." : "Submit Update"}
        </Button>
      </DialogFooter>
    </HeadersHelper>
  );
}
