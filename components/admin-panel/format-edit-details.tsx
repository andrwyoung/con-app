import React from "react";
import { ConDetailsFields } from "@/types/suggestion-types";
import { FieldRow } from "./admin-helpers";
import MapboxMiniMap from "../edit-modal/edit-pages/con-details-pages/con-details-helpers/page-3/mini-mapbox";

export default function FormatEditDetailsSuggestion({
  newInfo,
  changedFields,
}: {
  newInfo: ConDetailsFields;
  changedFields: string[] | undefined;
}) {
  return (
    <>
      {changedFields?.includes("conSize") && (
        <FieldRow label="Size:">{newInfo.con_size || "Cleared"}</FieldRow>
      )}

      {changedFields?.includes("selectedOrganizer") && (
        <FieldRow label="Organizer Name:">
          {newInfo.organizer_name
            ? `${newInfo.organizer_name} (${
                newInfo.organizer_id ? "Existing Organizer" : "New Organizer"
              })`
            : "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("description") && (
        <FieldRow label="Description:">
          {newInfo.new_description || "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("discontinued") && (
        <FieldRow label="Discontinued:">
          {newInfo.discontinued ? "Yes" : "No"}
        </FieldRow>
      )}

      {changedFields?.includes("tags") && (
        <FieldRow label="Tags:">
          {newInfo.new_tags?.length ? newInfo.new_tags.join(", ") : "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("socialLinks") && (
        <FieldRow label="Extra Links:">
          {newInfo.new_social_links
            ? newInfo.new_social_links
                .split(",")
                .map((link) => link.trim())
                .filter((link) => link.length > 0)
                .map((link, i) => (
                  <div key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-muted hover:underline transition-all"
                    >
                      {link}
                    </a>
                  </div>
                ))
            : "Cleared"}
        </FieldRow>
      )}

      {changedFields?.includes("website") && (
        <FieldRow label="Website:">
          {newInfo.new_website ? (
            <a
              href={newInfo.new_website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-muted hover:underline transition-all"
            >
              {newInfo.new_website}
            </a>
          ) : (
            "Cleared"
          )}
        </FieldRow>
      )}

      {changedFields?.includes("location") && (
        <>
          {newInfo.new_lat && newInfo.new_long ? (
            <MapboxMiniMap lat={newInfo.new_lat} long={newInfo.new_long} />
          ) : (
            <FieldRow label="Lat/Long: ">
              Error! Latitude or Longitude missing in database{" "}
            </FieldRow>
          )}
        </>
      )}
    </>
  );
}
