import { formatFullSingleDate } from "@/lib/helpers/time/date-formatters";
import { NewYearInfoFields } from "@/types/suggestion-types";
import React from "react";
import { FieldRow } from "./admin-helpers";
export default function FormatNewYearSuggestion({
  newInfo,
  changedFields,
}: {
  newInfo: NewYearInfoFields;
  changedFields: string[] | undefined;
}) {
  const showAll = newInfo.is_new_year;

  return (
    <>
      {(showAll || changedFields?.includes("eventStatus")) && (
        <FieldRow label="Status:">{newInfo.event_status}</FieldRow>
      )}

      {(showAll || changedFields?.includes("year")) && (
        <FieldRow label="Year:">{newInfo.year}</FieldRow>
      )}

      {(showAll || changedFields?.includes("startDate")) &&
        newInfo.start_date && (
          <FieldRow label="Start Date:">
            {formatFullSingleDate(newInfo.start_date)}
          </FieldRow>
        )}

      {(showAll || changedFields?.includes("endDate")) && newInfo.end_date && (
        <FieldRow label="End Date:">
          {formatFullSingleDate(newInfo.end_date)}
        </FieldRow>
      )}

      {(showAll || changedFields?.includes("venue")) && newInfo.venue && (
        <FieldRow label="Venue:">{newInfo.venue}</FieldRow>
      )}

      {(showAll || changedFields?.includes("location")) && newInfo.location && (
        <FieldRow label="Location:">{newInfo.location}</FieldRow>
      )}
    </>
  );
}
