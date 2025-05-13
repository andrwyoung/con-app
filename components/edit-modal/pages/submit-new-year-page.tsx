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
  NewYearInfoFields,
  SuggestionsMetadataFields,
} from "@/types/suggestion-types";
import { handleSubmitWrapper } from "./aa-helpers/handle-submit-wrapper";
import { buildInitialMetadata } from "@/lib/editing/approval-metadata";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckField } from "@/components/sidebar-panel/modes/filters/filter-helpers";
import { AnimatePresence, motion } from "framer-motion";
import { buildCompleteYearPayload } from "@/lib/editing/build-new-year";
import { pushApprovedNewYear } from "@/lib/editing/push-years";

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
          event_status: "EventScheduled",

          year: latestYear().year + 1,
          start_date: date.from.toISOString().split("T")[0] ?? "",
          end_date: date?.to?.toISOString().split("T")[0] ?? undefined,

          venue: latestYear().venue,
          location: latestYear().location,

          // suggestion table specific
          is_new_year: true,
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

          // FOR LATER:
          // grab last year's application start and end dates (keep em around)
          //
          // const aaFields: ArtistAlleyInfoFields = {
          //   aa_open_date: latestYear().aa_open_date,
          //   aa_deadline: latestYear().aa_deadline,
          //   aa_real_release: false,
          //   aa_link: undefined,
          //   aa_status_override: undefined,
          // };

          const newYearPacket = {
            yearInfo: buildCompleteYearPayload(payload, conDetails.id),
            suggestionId: suggestionInsert.id,
          };

          const confirmed = confirm(`Admin: Push real changes too?`);
          if (!confirmed) return;

          // KEY SECTION: add the new year
          await pushApprovedNewYear(newYearPacket, user.id);
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
