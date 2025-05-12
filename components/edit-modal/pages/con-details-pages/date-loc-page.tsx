import { NewYearInfoFields } from "@/types/suggestion-types";
import React from "react";

export default function DatesLocationPage({
  years,
  setYears,
}: {
  years: NewYearInfoFields[];
  setYears: (y: NewYearInfoFields[]) => void;
}) {
  console.log(setYears);

  return (
    <div className="space-y-4">
      {years.map((yearData) => (
        <div
          key={yearData.year}
          className="border rounded-md p-4 bg-muted text-sm space-y-1"
        >
          <p>
            <strong>Year:</strong> {yearData.year}
          </p>
          <p>
            <strong>Status:</strong> {yearData.event_status}
          </p>
          <p>
            <strong>Start:</strong> {yearData.start_date}
          </p>
          <p>
            <strong>End:</strong> {yearData.end_date ?? "N/A"}
          </p>
          <p>
            <strong>Google Maps Link:</strong> {yearData.g_link ?? "—"}
          </p>
          <p>
            <strong>Venue:</strong> {yearData.venue ?? "—"}
          </p>
          <p>
            <strong>Location:</strong> {yearData.location ?? "—"}
          </p>
          <p>
            <strong>Is New Year:</strong> {yearData.is_new_year ? "Yes" : "No"}
          </p>
        </div>
      ))}
    </div>
  );
}
