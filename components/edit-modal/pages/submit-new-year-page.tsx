import React, { useState } from "react";
import { DialogFooter } from "../../ui/dialog";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { FullConventionDetails } from "@/types/con-types";
import HeadersHelper, { DateRangeInput } from "../editor-helpers";
import { EditorSteps } from "../edit-con-modal";
import useShakeError from "@/hooks/use-shake-error";
import { useUserStore } from "@/stores/user-store";
import { supabaseAnon } from "@/lib/supabase/client";
import {
  ArtistAlleyInfoFields,
  NewYearInfoFields,
  SuggestionsMetadataFields,
} from "@/types/suggestion-types";
import { handleSubmitWrapper } from "./aa-helpers/handle-submit-wrapper";
import { toast } from "sonner";
import {
  buildApprovalMetadata,
  buildInitialMetadata,
} from "@/lib/editing/approval-metadata";
import { PostgrestError } from "@supabase/supabase-js";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckField } from "@/components/sidebar-panel/modes/filters/filter-helpers";
import { AnimatePresence, motion } from "framer-motion";

function isValidGMapLink(link: string): boolean {
  const trimmed = link.trim();
  return (
    trimmed.startsWith("https://www.google.com/maps") ||
    trimmed.startsWith("https://maps.app.goo.gl") ||
    trimmed.startsWith("https://goo.gl/maps")
  );
}

export default function SubmitNewYearPage({
  conDetails,
  setPage,
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditorSteps) => void;
}) {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [gLink, setGLink] = useState("");

  const [showGLink, setShowGLink] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { error, shake, triggerError } = useShakeError();

  const { user, profile } = useUserStore();
  const isAdmin = profile?.role === "ADMIN";
  const latestYear = () => {
    return conDetails.convention_years.reduce((latest, current) =>
      current.year > latest.year ? current : latest
    );
  };
  const validGMapLink = isValidGMapLink(gLink);

  const handleSubmit = async () => {
    await handleSubmitWrapper({
      setSubmitting,
      setPage,
      tryBlock: async () => {
        if (!date?.from) {
          triggerError("Please at least put a start date");
          setSubmitting(false);
          throw new Error("Validation failed");
        }

        if (gLink.trim() !== "" && !validGMapLink) {
          triggerError("Please enter a valid Google Map Link");
          setSubmitting(false);
          throw new Error("Validation failed");
        }

        const payload: NewYearInfoFields = {
          start_date: date.from.toISOString().split("T")[0],
          end_date: date?.to?.toISOString().split("T")[0] ?? undefined,
          g_link: gLink.trim() !== "" ? gLink.trim() : undefined,
        };

        const initMetadata: SuggestionsMetadataFields = buildInitialMetadata(
          user?.id ?? null
        );

        const { data: suggestionInsert, error: insertError } =
          await supabaseAnon
            .from("suggestions_new_year")
            .insert({
              convention_id: conDetails.id,
              ...payload,
              ...initMetadata,
            })
            .select()
            .single();
        if (insertError) throw insertError;

        if (user && isAdmin) {
          // create a new convention_year

          // important section. this is the user's data
          const conventionYearsPayload = {
            convention_id: conDetails.id,
            year: latestYear().year + 1, // IMPORTANT
            start_date: date.from.toISOString().split("T")[0],
            end_date: date?.to?.toISOString().split("T")[0] ?? undefined,
            event_status: "EventScheduled",
            venue: latestYear().venue,
            location: latestYear().location,
          };

          // resue the payload from above. redefined for clarity
          const newYearFields: NewYearInfoFields = payload;

          // grab last year's application start and end dates (keep em around)
          // set real release false
          const aaFields: ArtistAlleyInfoFields = {
            aa_open_date: latestYear().aa_open_date,
            aa_deadline: latestYear().aa_deadline,
            aa_real_release: false,
            aa_link: undefined,
            aa_watch_link: undefined,
            aa_status_override: undefined,
          };

          const confirmed = confirm(
            `Admin: you're adding a new year for ${conventionYearsPayload.year}. Are you sure?`
          );
          if (!confirmed) return;

          // KEY SECTION: add the new year
          try {
            await supabaseAnon.from("convention_years").insert({
              ...conventionYearsPayload,
              ...newYearFields,
              ...aaFields,
            });
          } catch (err) {
            const typedError = err as PostgrestError;

            if (
              typedError.code === "23505" || // unique_violation
              (typedError.message &&
                typedError.message.includes("unique_con_year"))
            ) {
              toast.error("That year already exists.");
              throw new Error("Existing Year");
            }

            throw err; // rethrow anything else
          }

          // log that change into suggestions table
          const updatesMetadata: SuggestionsMetadataFields =
            buildApprovalMetadata(user.id);

          await supabaseAnon
            .from("suggestions_new_year")
            .update(updatesMetadata)
            .eq("id", suggestionInsert.id);

          toast.success("Admin: change pushed through!");
        }

        // reset states
        setDate(undefined);
        setGLink("");
      },
    });
  };

  return (
    <HeadersHelper
      title="Submit New Dates"
      website={conDetails.website ?? undefined}
    >
      <div>
        <div className="flex flex-col gap-2 py-4">
          <DateRangeInput
            label="Event Dates"
            value={date}
            onChange={setDate}
            placeholder="Select event range"
          />
          <CheckField
            text="At a new location?"
            isChecked={showGLink}
            onChange={() => setShowGLink(!showGLink)}
          />
          <AnimatePresence initial={false}>
            {showGLink && (
              <motion.div
                key="details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex flex-row justify-between">
                    <Label
                      htmlFor="glink"
                      className="text-primary-text text-sm font-medium"
                    >
                      Google Maps Link:
                    </Label>
                    {gLink.trim() != "" &&
                      (validGMapLink ? (
                        <span className="text-green-600 text-xs ml-1">
                          ✓ Nice Google Maps Link!
                        </span>
                      ) : (
                        <span className="text-rose-600 text-xs ml-1">
                          ✗ Uh oh. Is this a Google Map link?
                        </span>
                      ))}
                  </div>
                  <Input
                    id="glink"
                    type="text"
                    value={gLink}
                    onChange={(e) => setGLink(e.target.value)}
                    placeholder="Enter Google Maps Link"
                    className="text-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <DialogFooter>
        <div className="flex flex-col gap-2 items-center">
          <Button onClick={handleSubmit} disabled={submitting || !date}>
            {submitting ? "Submitting..." : "Submit Update"}
          </Button>
          {error && (
            <span
              id="aa-update-error"
              className={`text-sm ${shake && "animate-shake"} text-red-500`}
            >
              {error}
            </span>
          )}
        </div>
      </DialogFooter>
    </HeadersHelper>
  );
}
