import { formatFullSingleDate } from "@/lib/helpers/time/date-formatters";
import { ArtistAlleyInfoFields } from "@/types/suggestion-types";
import React from "react";
import { FieldRow } from "./admin-helpers";

export default function FormatAASuggestion({
  newInfo,
  changedFields,
}: {
  newInfo: ArtistAlleyInfoFields;
  changedFields: string[] | undefined;
}) {
  return (
    <div
      className="flex flex-col gap-2 px-2 py-4
    bg-secondary-lightest rounded-lg text-sm text-primary-text"
    >
      {(changedFields?.includes("aaStatus") ||
        changedFields?.includes("aaExistence")) && (
        <FieldRow label="Status:">
          {newInfo.aa_status_override ?? "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("website") && (
        <FieldRow label="Link:">
          {newInfo.aa_link ? (
            <a
              href={newInfo.aa_link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-muted hover:underline transition-all"
            >
              {newInfo.aa_link}
            </a>
          ) : (
            <p>Link Cleared</p>
          )}
        </FieldRow>
      )}

      {changedFields?.includes("startDate") && (
        <FieldRow label="Open Date:">
          {newInfo.aa_open_date
            ? formatFullSingleDate(newInfo.aa_open_date)
            : "Date Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("deadline") && (
        <FieldRow label="Deadline:">
          {newInfo.aa_deadline
            ? formatFullSingleDate(newInfo.aa_deadline)
            : "Date Cleared"}
        </FieldRow>
      )}
    </div>
  );
}
