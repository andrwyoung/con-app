import { supabaseAnon } from "@/lib/supabase/client";
import { ArtistAlleySuggestion } from "@/types/suggestion-types";
import React, { useEffect, useState } from "react";
import { lightweightConInfo } from "./page";
import {
  formatFullSingleDate,
  formatSubmittedAt,
} from "@/lib/helpers/time/date-formatters";

function GridWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-2 grid grid-cols-2 gap-4 items-start border-t border-primary-muted pt-2">
      {children}
    </div>
  );
}

export default function SuggestionPanel({
  selectCon,
}: {
  selectCon: (c: lightweightConInfo) => void;
}) {
  const [suggestions, setSuggestions] = useState<ArtistAlleySuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const { data, error } = await supabaseAnon
        .from("aa_admin_items")
        .select("*")
        .eq("approval_status", "pending"); // adjust if your enum differs

      if (error) {
        console.error("Error fetching suggestions:", error);
      } else {
        setSuggestions(data || []);
      }
      setLoading(false);
    };

    fetchSuggestions();
  }, []);

  return (
    <div
      className="p-6 flex flex-col 
      overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent"
    >
      <h1 className="text-xl font-semibold text-primary-text mb-4">
        Artist Alley Suggestions
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : suggestions.length === 0 ? (
        <p>No pending suggestions!</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((sugg) => (
            <div
              key={sugg.id}
              className={`p-2 rounded-lg transition-all
               text-sm flex flex-col gap-4 ${
                 selectedId === sugg.id
                   ? "ring-2 ring-secondary bg-primary-light cursor-default"
                   : "bg-secondary-lightest hover:bg-secondary-light cursor-pointer "
               }`}
              onClick={() => {
                if (sugg.convention_name && sugg.convention_id) {
                  selectCon({
                    name: sugg.convention_name,
                    id: sugg.convention_id,
                  });
                }

                setSelectedId(sugg.id ?? null);
              }}
            >
              <div className="font-semibold text-md flex flex-row items-center gap-2 px-2">
                <h1>
                  {sugg.convention_name} ({sugg.convention_year?.year})
                </h1>
                <div className="rounded-full px-2 py-0.5 text-xs bg-green-200">
                  Latest Year
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-4 px-4 bg-white/50 rounded-lg">
                <h2 className="flex text-xs font-semibold">current:</h2>
                <h2 className="flex  text-xs font-semibold">new change:</h2>

                {sugg.aa_status_override && (
                  <GridWrapper>
                    {sugg.convention_year?.aa_status_override ? (
                      <div>
                        Old Status:
                        <br />
                        <p className="text-primary-text text-xs">
                          {sugg.convention_year.aa_status_override}
                        </p>
                      </div>
                    ) : (
                      <div>No Status</div>
                    )}
                    <div>
                      New Status:
                      <br />
                      <p className="text-primary-text text-xs">
                        {sugg.aa_status_override}
                      </p>
                    </div>
                  </GridWrapper>
                )}

                {sugg.aa_link && (
                  <GridWrapper>
                    {sugg.convention_year?.aa_link ? (
                      <div>
                        Link:
                        <br />
                        <a
                          href={sugg.aa_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-text cursor-pointer hover:text-primary-muted
                        hover:underline transition-all text-xs line-clamp-2"
                        >
                          {sugg.convention_year?.aa_link}
                        </a>
                      </div>
                    ) : (
                      <div>No Link</div>
                    )}

                    <div>
                      Link:
                      <br />
                      <a
                        href={sugg.aa_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-text cursor-pointer hover:text-primary-muted
                         hover:underline transition-all text-xs line-clamp-2"
                      >
                        {sugg.aa_link}
                      </a>
                    </div>
                  </GridWrapper>
                )}
                {sugg.aa_open_date && (
                  <GridWrapper>
                    {sugg.convention_year?.aa_open_date ? (
                      <div>
                        Old Open Date:
                        <br />
                        <p className="text-primary-text text-xs">
                          {formatFullSingleDate(
                            sugg.convention_year.aa_open_date
                          )}
                        </p>
                      </div>
                    ) : (
                      <div>No Open Date</div>
                    )}
                    <div>
                      New Open Date:
                      <br />
                      <p className="text-primary-text text-xs">
                        {formatFullSingleDate(sugg.aa_open_date)}
                      </p>
                    </div>
                  </GridWrapper>
                )}

                {sugg.aa_deadline && (
                  <GridWrapper>
                    {sugg.convention_year?.aa_deadline ? (
                      <div>
                        Old Deadline:
                        <br />
                        <p className="text-primary-text text-xs">
                          {formatFullSingleDate(
                            sugg.convention_year.aa_deadline
                          )}
                        </p>
                      </div>
                    ) : (
                      <div>No Deadline</div>
                    )}
                    <div>
                      New Deadline:
                      <br />
                      <p className="text-primary-text text-xs">
                        {formatFullSingleDate(sugg.aa_deadline)}
                      </p>
                    </div>
                  </GridWrapper>
                )}
              </div>
              <div className="text-xs px-2">
                Submitted by: {sugg.submitted_username || "Anonymous"} at{" "}
                {formatSubmittedAt(sugg.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
