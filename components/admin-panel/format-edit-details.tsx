import React from "react";
import { ConDetailsFields } from "@/types/suggestion-types";
import { FieldRow } from "./admin-helpers";

export default function FormatEditDetailsSuggestion({
  newInfo,
  changedFields,
}: {
  newInfo: ConDetailsFields;
  changedFields: string[] | undefined;
}) {
  return (
    <>
      {changedFields?.includes("con_size") && (
        <FieldRow label="Size:">{newInfo.con_size || "Cleared"}</FieldRow>
      )}

      {changedFields?.includes("organizer_id") && (
        <FieldRow label="Organizer ID:">
          {newInfo.organizer_id || "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("organizer_name") && (
        <FieldRow label="Organizer Name:">
          {newInfo.organizer_name || "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("new_description") && (
        <FieldRow label="Description:">
          {newInfo.new_description || "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("discontinued") && (
        <FieldRow label="Discontinued:">
          {newInfo.discontinued ? "Yes" : "No"}
        </FieldRow>
      )}

      {changedFields?.includes("new_tags") && (
        <FieldRow label="Tags:">
          {newInfo.new_tags?.length ? newInfo.new_tags.join(", ") : "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("new_social_links") && (
        <FieldRow label="Social Links:">
          {newInfo.new_social_links || "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("new_website") && (
        <FieldRow label="Website:">
          {newInfo.new_website ? (
            <a
              href={newInfo.new_website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-600"
            >
              {newInfo.new_website}
            </a>
          ) : (
            "Cleared"
          )}
        </FieldRow>
      )}

      {changedFields?.includes("new_lat") && (
        <FieldRow label="Latitude:">
          {newInfo.new_lat !== undefined ? newInfo.new_lat : "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("new_long") && (
        <FieldRow label="Longitude:">
          {newInfo.new_long !== undefined ? newInfo.new_long : "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("notes") && (
        <FieldRow label="Notes:">{newInfo.notes || "Cleared"}</FieldRow>
      )}
    </>
  );
}
