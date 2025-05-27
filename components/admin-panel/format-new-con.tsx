import React from "react";
import { NewConFields } from "@/types/suggestion-types";
import { formatFullSingleDate } from "@/lib/helpers/time/date-formatters";
import { FieldRow } from "./admin-helpers";
import MapboxMiniMap from "../edit-modal/edit-pages/con-details-pages/con-details-helpers/page-3/mini-mapbox";

export default function FormatNewConSuggestion({
  newInfo,
}: {
  newInfo: NewConFields;
}) {
  return (
    <>
      <FieldRow label="Convention Name:">{newInfo.convention_name}</FieldRow>

      {newInfo.website && (
        <FieldRow label="Website:">
          <a
            href={newInfo.website}
            className="hover:text-primary-muted hover:underline transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {newInfo.website}
          </a>
        </FieldRow>
      )}

      {newInfo.cs_description && (
        <FieldRow label="Description:">{newInfo.cs_description}</FieldRow>
      )}

      {newInfo.year && <FieldRow label="Year:">{newInfo.year}</FieldRow>}

      {newInfo.start_date && (
        <FieldRow label="Start Date:">
          {formatFullSingleDate(newInfo.start_date)}
        </FieldRow>
      )}

      {newInfo.end_date && (
        <FieldRow label="End Date:">
          {formatFullSingleDate(newInfo.end_date)}
        </FieldRow>
      )}

      {newInfo.venue && <FieldRow label="Venue:">{newInfo.venue}</FieldRow>}

      {newInfo.location && (
        <FieldRow label="Location:">{newInfo.location}</FieldRow>
      )}

      {newInfo.location_lat && newInfo.location_long && (
        <MapboxMiniMap
          lat={newInfo.location_lat}
          long={newInfo.location_long}
        />
      )}
    </>
  );
}
