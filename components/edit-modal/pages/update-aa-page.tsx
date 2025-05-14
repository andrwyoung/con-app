// PAGE 2 of edit-con-modal: lets people edit the artist alley information

import React, { useState } from "react";
import { DialogFooter } from "../../ui/dialog";
import { parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { ConventionYear, FullConventionDetails } from "@/types/con-types";
import HeadersHelper, { SingleDateInput } from "../editor-helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabaseAnon } from "@/lib/supabase/client";
import { log } from "@/lib/utils";
import { toast } from "sonner";
import useShakeError from "@/hooks/use-shake-error";
import { AnimatePresence, motion } from "framer-motion";
import { FaCaretDown } from "react-icons/fa6";
import { ArtistAlleyStatus } from "@/types/artist-alley-types";
import { useUserStore } from "@/stores/user-store";
import { NukeAAInfo } from "@/lib/editing/nuke-aa-year";
import {
  ArtistAlleyInfoFields,
  SuggestionsMetadataFields,
} from "@/types/suggestion-types";
import { handleSubmitWrapper } from "../handle-submit-wrapper";
import {
  buildApprovalMetadata,
  buildInitialMetadata,
} from "@/lib/editing/approval-metadata";
import { EditModalState } from "../edit-con-modal";
import { AAFormState } from "@/types/editor-types";
import { useFormReducer } from "@/lib/editing/reducer-helper";
import ResettableFieldWrapper from "../reset-buttons";
import { Input } from "@/components/ui/input";

export default function UpdateAAPage({
  conDetails,
  setPage,
  setRefreshKey,
  year,
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditModalState) => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  year: number;
}) {
  const { user, profile } = useUserStore();
  const { error, shake, triggerError } = useShakeError();

  const relevantYearObject = conDetails.convention_years.find(
    (y) => y.year === year
  );

  // the 5 important fields
  //
  const prevAAOverride = relevantYearObject?.aa_status_override;
  const prevOverRideTrue =
    prevAAOverride === "invite_only" || prevAAOverride === "no_aa";

  const initialAAFormState: AAFormState = {
    startDate: relevantYearObject?.aa_open_date
      ? new Date(relevantYearObject.aa_open_date)
      : undefined,
    deadline: relevantYearObject?.aa_deadline
      ? new Date(relevantYearObject.aa_deadline)
      : undefined,
    website: relevantYearObject?.aa_link ?? null,
    aaExistence: prevOverRideTrue ? prevAAOverride : "unknown",
    aaStatus: "unknown", // or derive from current logic if available
  };

  const {
    state: aaState,
    setField,
    resetField,
    hasChanged,
    getChangedValues,
  } = useFormReducer<AAFormState>(initialAAFormState);

  // helpers

  const [submitting, setSubmitting] = useState(false);
  const [isQuickOpen, setIsQuickOpen] = useState(!prevOverRideTrue); // hacky

  const isAdmin = profile?.role === "ADMIN";
  const aaExists = aaState.current.aaExistence === "unknown";

  const deriveIsRealRelease = (): boolean => {
    if (relevantYearObject?.aa_real_release) return true;
    if (!aaState.current.startDate) return false;

    return true;
  };

  const deriveOverRideStatus = (): ArtistAlleyStatus | null => {
    // existence statuses get first priority
    if (aaState.current.aaExistence !== "unknown")
      return aaState.current.aaExistence;
    if (aaState.current.aaStatus != "unknown") return aaState.current.aaStatus;

    return null;
  };

  const deriveStartDate = (): string | undefined => {
    // if it hasn't changed, then leave it alone
    if (!hasChanged("startDate") && !hasChanged("aaStatus")) return undefined;

    const now = new Date();

    // 1: If status is "open"
    if (aaState.current.aaStatus === "open") {
      if (!aaState.current.startDate) {
        // 1a: No start date provided just mark it as now
        return now.toISOString();
      }
      // 1b: else use the earlier of provided startDate and now
      return aaState.current.startDate < now
        ? aaState.current.startDate.toISOString()
        : now.toISOString();
    }

    // 2: If startDate exists (but not "open"), return it
    if (aaState.current.startDate)
      return aaState.current.startDate.toISOString();

    // 3: else we don't care
    return undefined;
  };

  const deriveEndDate = (): string | undefined => {
    // if it hasn't changed, then leave it alone
    if (!hasChanged("deadline") && !hasChanged("aaStatus")) return undefined;

    const now = new Date();
    const existingDeadline = relevantYearObject?.aa_deadline;

    // 1: manually marked as closed:
    if (aaState.current.aaStatus === "closed") {
      // if there is already a close date in the system
      // that is EARLIER than today, leave it alone
      if (existingDeadline && parseISO(existingDeadline) < now) {
        return undefined;
      }
      // else put today as close date
      return now.toISOString();
    }

    // 2: someone says it's waitlist
    if (aaState.current.aaStatus === "waitlist") {
      // TODO: if there is already a date in the system, leave it alone
      if (existingDeadline) return undefined;
      // but if they also put a deadline in there, use that
      // else then we close it now
      return aaState.current.deadline
        ? aaState.current.deadline.toISOString()
        : now.toISOString();
    }

    // 3: someone gave a deadline
    if (aaState.current.deadline) {
      return aaState.current.deadline.toISOString();
    }

    // 4: else nothing happened
    return undefined;
  };

  const handleSubmit = async () => {
    await handleSubmitWrapper({
      setSubmitting,
      setPage,
      tryBlock: async () => {
        if (
          !aaState.current.website ||
          (aaState.current.website.trim() === "" && aaExists)
        ) {
          triggerError("Please at least add a link");
          setSubmitting(false);
          throw new Error("Validation failed");
        }

        const cleanedWebsite = aaState.current.website
          ? aaState.current.website?.trim()
          : null;

        // clean the website link a lil
        if (cleanedWebsite && cleanedWebsite !== "") {
          try {
            const url = new URL(cleanedWebsite);
            if (!["http:", "https:"].includes(url.protocol)) {
              throw new Error();
            }
          } catch {
            triggerError("Please enter a valid URL.");
            setSubmitting(false);
            throw new Error("Validation failed");
          }
        }

        const aaInfo: ArtistAlleyInfoFields = {
          aa_open_date: deriveStartDate(),
          aa_deadline: deriveEndDate(),
          aa_real_release: deriveIsRealRelease(),
          aa_link: hasChanged("website") ? cleanedWebsite : undefined,
          aa_status_override:
            hasChanged("aaExistence") && hasChanged("aaStatus")
              ? (deriveOverRideStatus() as ArtistAlleyStatus)
              : undefined,
        };

        const initMetadata: SuggestionsMetadataFields = buildInitialMetadata(
          user?.id ?? null
        );

        // Make a new suggestion first
        const { data: suggestionInsert, error: insertError } =
          await supabaseAnon
            .from("suggestions_artist_alley")
            .insert({
              convention_year_id: relevantYearObject?.id,
              changed_fields: Object.keys(getChangedValues()),
              ...initMetadata,
              ...aaInfo,
            })
            .select()
            .single();

        if (insertError) throw insertError;

        log("isAdmin?:", isAdmin);
        if (user && isAdmin) {
          // Update real convention_years table

          // cast to check for types
          const updates: Partial<ConventionYear> = aaInfo;

          const confirmed = confirm(
            `Admin: Suggestion Submitted. Do you also want to update/overwrite the actual info?`
          );
          if (!confirmed) return;

          await supabaseAnon
            .from("convention_years")
            .update(updates)
            .eq("id", relevantYearObject?.id);

          // Also mark the suggestion as approved
          const updatesMetadata: SuggestionsMetadataFields =
            buildApprovalMetadata(user.id);

          await supabaseAnon
            .from("suggestions_artist_alley")
            .update(updatesMetadata)
            .eq("id", suggestionInsert.id);

          toast.success("Admin: change pushed through!");
        }

        // reset states
        setRefreshKey((prev) => prev + 1);
      },
    });
  };

  return (
    <HeadersHelper
      title={`Add ${year} Artist Alley Info`}
      website={conDetails.website ?? undefined}
    >
      <>
        {aaExists && (
          <>
            <div className="flex flex-col gap-4 py-8">
              <ResettableFieldWrapper
                label={`Artist Alley Link:`}
                hasChanged={hasChanged("website")}
                onReset={() => resetField("website")}
                rightElement={
                  aaState.current.website && (
                    <span className="text-green-600 text-xs ml-1">✓ Nice!</span>
                  )
                }
              >
                <Input
                  type="text"
                  value={aaState.current.website ?? ""}
                  onChange={(e) => setField("website")(e.target.value)}
                  placeholder={"Artist Alley Link"}
                  className="text-sm"
                />
              </ResettableFieldWrapper>

              <ResettableFieldWrapper
                label={`Link Status:`}
                hasChanged={hasChanged("aaStatus")}
                onReset={() => resetField("aaStatus")}
              >
                <Select
                  value={aaState.current.aaStatus as string}
                  onValueChange={(val) =>
                    setField("aaStatus")(
                      val as
                        | "unknown"
                        | "open"
                        | "watch_link"
                        | "closed"
                        | "waitlist"
                    )
                  }
                >
                  <SelectTrigger className="text-primary-text border rounded-lg px-2 py-2 shadow-xs w-fit">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">No Update</SelectItem>
                    <SelectItem value="open">Application Open</SelectItem>

                    <SelectItem value="closed">Application Closed</SelectItem>
                    <SelectItem value="waitlist">Waitlist</SelectItem>
                    <SelectItem value="watch_link">
                      Announcement Coming
                    </SelectItem>
                  </SelectContent>
                </Select>
              </ResettableFieldWrapper>
            </div>

            <button
              onClick={() => setIsQuickOpen((prev) => !prev)}
              className="text-sm text-primary-text cursor-pointer 
        hover:text-primary-muted transition flex items-center gap-1 mb-4 "
            >
              Edit Additional Info:
              <FaCaretDown
                className={`size-[12px] text-primary-muted transform translate-y-[1px] transition-transform duration-200 ${
                  !isQuickOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </>
        )}
        <AnimatePresence initial={false}>
          {!isQuickOpen && (
            <motion.div
              key="details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {aaExists && (
                <>
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
                      <ResettableFieldWrapper
                        label="Release Date:"
                        hasChanged={hasChanged("startDate")}
                        onReset={() => resetField("startDate")}
                        rightElement={
                          aaState.current.startDate && (
                            <span className="text-green-600 text-xs ml-1">
                              ✓ Nice!
                            </span>
                          )
                        }
                      >
                        <SingleDateInput
                          value={aaState.current.startDate}
                          onChange={setField("startDate")}
                          placeholder="Add open date"
                        />
                      </ResettableFieldWrapper>

                      <ResettableFieldWrapper
                        label="Deadline:"
                        hasChanged={hasChanged("deadline")}
                        onReset={() => resetField("deadline")}
                        rightElement={
                          aaState.current.deadline && (
                            <span className="text-green-600 text-xs ml-1">
                              ✓ Nice!
                            </span>
                          )
                        }
                      >
                        <SingleDateInput
                          value={aaState.current.deadline}
                          onChange={setField("deadline")}
                          placeholder="Add deadline"
                        />
                      </ResettableFieldWrapper>
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-2 items-baseline py-6">
                <ResettableFieldWrapper
                  label={`Artist Alley Existence:`}
                  hasChanged={hasChanged("aaExistence")}
                  onReset={() => resetField("aaExistence")}
                >
                  <Select
                    value={aaState.current.aaExistence as string}
                    onValueChange={(val) =>
                      setField("aaExistence")(
                        val as "unknown" | "no_aa" | "invite_only"
                      )
                    }
                  >
                    <SelectTrigger className="text-primary-text border rounded-lg px-2 py-2 shadow-xs">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">
                        Artist Alley Exists
                      </SelectItem>
                      <SelectItem value="invite_only">Invite Only</SelectItem>
                      <SelectItem value="no_aa">No Artist Alley</SelectItem>
                    </SelectContent>
                  </Select>
                </ResettableFieldWrapper>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
      <DialogFooter>
        <div className="flex flex-col gap-2 items-center">
          <Button
            onClick={handleSubmit}
            disabled={
              submitting || Object.keys(getChangedValues()).length === 0
            }
          >
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
          {profile?.role === "ADMIN" && (
            <button
              type="submit"
              className="text-rose-500 transition-all outline-2 outline-rose-300 hover:outline-rose-400 hover:bg-rose-200 
              px-3 py-1 rounded-lg cursor-pointer text-xs mt-2"
              onClick={async () => {
                const confirmed = confirm(
                  `Are you sure you want to wipe all Artist Alley info for ${year}?`
                );
                if (!confirmed) return;

                if (relevantYearObject && user?.id) {
                  await NukeAAInfo(relevantYearObject.id, user.id);
                }
              }}
            >
              Admin: Clear {year} AA Data
            </button>
          )}
        </div>
      </DialogFooter>
    </HeadersHelper>
  );
}
