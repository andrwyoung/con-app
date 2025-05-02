import React, { useState } from "react";
import { DialogFooter } from "../../ui/dialog";
import { parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { FullConventionDetails } from "@/types/con-types";
import HeadersHelper, { SingleDateInput } from "../editor-helpers";
import { EditorSteps } from "../edit-con-modal";
import { AAWebsiteInput } from "./aa-helpers/aa-website-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
import { handleSubmitWrapper } from "./aa-helpers/handle-submit-wrapper";
import {
  buildApprovalMetadata,
  buildInitialMetadata,
} from "@/lib/editing/approval-metadata";

export default function UpdateAAPage({
  conDetails,
  setPage,
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditorSteps) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [isQuickOpen, setIsQuickOpen] = useState(true);

  const { user, profile } = useUserStore();
  const { error, shake, triggerError } = useShakeError();
  const [year, setYear] = useState(() => {
    const years = conDetails.convention_years.map((y) => y.year);
    return Math.max(...years);
  });

  // the 5 important fields
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [deadline, setDeadline] = React.useState<Date | undefined>(undefined);
  const [website, setWebsite] = useState<string | null>(null);
  const [aaExistence, setAAExistence] = useState<Extract<
    ArtistAlleyStatus,
    "unknown" | "invite_only" | "no_aa"
  > | null>("unknown");
  const [aaStatus, setAAStatus] =
    useState<
      Extract<
        ArtistAlleyStatus,
        "unknown" | "open" | "watch_link" | "closed" | "waitlist"
      >
    >("unknown");

  const isAdmin = profile?.role === "ADMIN";
  const relevantYearObject = conDetails.convention_years.find(
    (y) => y.year === year
  );
  const aaExists = aaExistence === "unknown";

  const deriveIsRealRelease = (): boolean => {
    if (aaStatus === "open" || aaStatus === "closed" || aaStatus === "waitlist")
      return true;
    if (startDate || deadline) return true;

    return false;
  };

  const deriveOverRideStatus = (): ArtistAlleyStatus | null => {
    // existence statuses get first priority
    if (aaExistence !== "unknown") return aaExistence;
    if (aaStatus != "unknown") return aaStatus;

    return null;
  };

  const deriveStartDate = (): string | undefined => {
    const now = new Date();

    // 1: If status is "open"
    if (aaStatus === "open") {
      if (!startDate) {
        // 1a: No start date provided just mark it as now
        return now.toISOString();
      }
      // 1b: else use the earlier of provided startDate and now
      return startDate < now ? startDate.toISOString() : now.toISOString();
    }

    // 2: If startDate exists (but not "open"), return it
    if (startDate) return startDate.toISOString();

    // 3: else we don't care
    return undefined;
  };

  const deriveEndDate = (): string | undefined => {
    const now = new Date();
    const existingDeadline = relevantYearObject?.aa_deadline;

    // 1: manually marked as closed:
    if (aaStatus === "closed") {
      // if there is already a close date in the system
      // that is EARLIER than today, leave it alone
      if (existingDeadline && parseISO(existingDeadline) < now) {
        return undefined;
      }
      // else put today as close date
      return now.toISOString();
    }

    // 2: someone says it's waitlist
    if (aaStatus === "waitlist") {
      // TODO: if there is already a date in the system, leave it alone
      if (existingDeadline) return undefined;
      // but if they also put a deadline in there, use that
      // else then we close it now
      return deadline ? deadline.toISOString() : now.toISOString();
    }

    // 3: someone gave a deadline
    if (deadline) {
      return deadline.toISOString();
    }

    // 4: else nothing happened
    return undefined;
  };

  const handleSubmit = async () => {
    await handleSubmitWrapper({
      setSubmitting,
      setPage,
      tryBlock: async () => {
        if (!website || (website.trim() === "" && aaExists)) {
          triggerError("Please at least add a link");
          setSubmitting(false);
          throw new Error("Validation failed");
        }

        const cleanedWebsite = website ? website?.trim() : null;

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
          aa_link: cleanedWebsite,
          aa_status_override: deriveOverRideStatus() as ArtistAlleyStatus,
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
              ...initMetadata,
              ...aaInfo,
            })
            .select()
            .single();

        if (insertError) throw insertError;

        log("isAdmin?:", isAdmin);
        if (user && isAdmin) {
          // Update real convention_years table
          const updates: ArtistAlleyInfoFields = {
            aa_open_date: deriveStartDate(),
            aa_deadline: deriveEndDate(),
            aa_real_release: deriveIsRealRelease(),
            aa_link: cleanedWebsite,
            aa_status_override: deriveOverRideStatus() as ArtistAlleyStatus,
          };

          const confirmed = confirm(
            `Admin: You're changing public Artist Alley info. Are you sure?`
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
        setStartDate(undefined);
        setDeadline(undefined);
        setWebsite("");
        setAAExistence("unknown");
        setAAStatus("unknown");
      },
    });
  };

  return (
    <HeadersHelper
      title={`Add Artist Alley Info`}
      website={conDetails.website ?? undefined}
    >
      <>
        {aaExists && (
          <>
            <div className="flex flex-col gap-4 py-8">
              <AAWebsiteInput
                label="Application Link (or where it'll appear)"
                website={website}
                onChange={setWebsite}
                placeholder="Link"
              />
              <div className="flex flex-row gap-2">
                <Label className="text-sm font-medium text-primary-text">
                  Link Status:
                </Label>
                <Select
                  value={aaStatus as string}
                  onValueChange={(val) =>
                    setAAStatus(
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
                {/* <CheckField
                text="Application is open!"
                isChecked={appsOpen}
                onChange={() => setAppsOpen(!appsOpen)}
                isDisabled={isWatched}
              />
              <CheckField
                text="Correct Link but no info yet"
                isChecked={isWatched}
                onChange={() => setIsWatched(!isWatched)}
                isDisabled={appsOpen}
              /> */}
                {/* <CheckField
            text="Invite Only"
            isChecked={isInviteOnly}
            onChange={() => setIsInviteOnly(!isInviteOnly)}
            isDisabled={appsOpen || isWatched}
          /> */}
              </div>
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
                  <div className="flex flex-col gap-1 mb-2">
                    <Label className="text-primary-text font-medium text-sm">
                      Select a Convention Year
                    </Label>
                    <span className="text-xs text-primary-muted">
                      You’re adding info for a specific year of this con.
                    </span>
                    <div className="pt-1">
                      <Select
                        value={String(year)}
                        onValueChange={(val) => setYear(Number(val))}
                      >
                        <SelectTrigger className="border text-primary-text px-3 py-2 rounded-lg text-sm">
                          <SelectValue placeholder="Pick a year" />
                        </SelectTrigger>
                        <SelectContent>
                          {conDetails.convention_years.map((y) => (
                            <SelectItem key={y.year} value={String(y.year)}>
                              {y.year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 pb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
                      <div className="flex flex-col">
                        <SingleDateInput
                          label="Release Date:"
                          // subheader={`Or ETA when it usually opens`}
                          value={startDate}
                          onChange={setStartDate}
                          placeholder="Add open date"
                        />
                        {/* {startDate && isFuture(startDate) && (
                          <CheckField
                            text={"Official release date"}
                            isChecked={isRealRelease}
                            onChange={() => setIsRealRelease(!isRealRelease)}
                          />
                        )} */}
                      </div>
                      <SingleDateInput
                        label="Deadline:"
                        // subheader={`Put the date you saw it close`}
                        value={deadline}
                        onChange={setDeadline}
                        placeholder="Add deadline"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-2 items-baseline pt-4 pb-8">
                <Label className="text-sm font-medium text-primary-text mb-1">
                  Artist Alley Existence:
                </Label>
                <Select
                  value={aaExistence as string}
                  onValueChange={(val) =>
                    setAAExistence(val as "unknown" | "no_aa" | "invite_only")
                  }
                >
                  <SelectTrigger className="text-primary-text border rounded-lg px-2 py-2 shadow-xs">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">Artist Alley Exists</SelectItem>
                    <SelectItem value="invite_only">Invite Only</SelectItem>
                    <SelectItem value="no_aa">No Artist Alley</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
      <DialogFooter>
        <div className="flex flex-col gap-2 items-center">
          <Button onClick={handleSubmit} disabled={submitting}>
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
