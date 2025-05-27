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
  return (
    <div className="flex flex-col gap-2 px-2 py-4 bg-secondary-lightest rounded-lg text-sm text-primary-text">
      {changedFields?.includes("eventStatus") && (
        <FieldRow label="Event Status:">{newInfo.event_status}</FieldRow>
      )}

      {changedFields?.includes("year") && (
        <FieldRow label="Year:">{newInfo.year}</FieldRow>
      )}

      {changedFields?.includes("startDate") && newInfo.start_date && (
        <FieldRow label="Start Date:">
          {formatFullSingleDate(newInfo.start_date)}
        </FieldRow>
      )}

      {changedFields?.includes("endDate") && newInfo.end_date && (
        <FieldRow label="End Date:">
          {formatFullSingleDate(newInfo.end_date)}
        </FieldRow>
      )}

      {changedFields?.includes("venue") && newInfo.venue && (
        <FieldRow label="Venue:">{newInfo.venue}</FieldRow>
      )}

      {changedFields?.includes("location") && newInfo.location && (
        <FieldRow label="Location:">{newInfo.location}</FieldRow>
      )}
    </div>
  );
}
