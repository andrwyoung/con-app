import React, { useState } from "react";
import { DialogFooter } from "../../ui/dialog";
import { isFuture } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ArtistAlleyInfoFields,
  FullConventionDetails,
} from "@/types/con-types";
import HeadersHelper, { SingleDateInput } from "../editor-helpers";
import { EditorSteps } from "../edit-con-modal";
import { CheckField } from "@/components/sidebar-panel/modes/filters/filter-helpers";
import { AAWebsiteInput, normalizeURL } from "./aa-helpers/aa-website-input";
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
import { checkIsAdmin } from "@/lib/editing/authen";
import { toast } from "sonner";
import useShakeError from "@/hooks/use-shake-error";
import { AnimatePresence, motion } from "framer-motion";
import { FaCaretDown } from "react-icons/fa6";
import { ArtistAlleyStatus } from "@/types/artist-alley-types";
import { useUserStore } from "@/stores/user-store";
import { NukeAAInfo } from "@/lib/editing/aa-submission";

export default function UpdateAAPage({
  conDetails,
  setPage,
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditorSteps) => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const { error, shake, triggerError } = useShakeError();
  const [year, setYear] = useState(() => {
    const years = conDetails.convention_years.map((y) => y.year);
    return Math.max(...years);
  });

  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [deadline, setDeadline] = React.useState<Date | undefined>(undefined);
  const [isRealRelease, setIsRealRelease] = useState(false);
  const [website, setWebsite] = useState<string | null>(null);
  const [appsOpen, setAppsOpen] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [aaStatusType, setAAStatusType] = useState<ArtistAlleyStatus>("open");

  const [isQuickOpen, setIsQuickOpen] = useState(true);

  const { user, profile } = useUserStore();
  const yearId = conDetails.convention_years.find((y) => y.year === year)?.id;

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      if (
        !startDate &&
        !deadline &&
        !appsOpen &&
        !isWatched &&
        (!website || website.trim() === "") &&
        aaStatusType === "open"
      ) {
        triggerError("Please fill in at least one field.");
        setSubmitting(false);
        return;
      }

      if (website && website.trim() !== "") {
        const cleaned = normalizeURL(website);
        try {
          const url = new URL(cleaned);
          if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error();
          }
          setWebsite(cleaned); // overwrite state with cleaned version
        } catch {
          triggerError("Please enter a valid URL.");
          setSubmitting(false);
          return;
        }
      }

      const aaInfo: ArtistAlleyInfoFields = {
        aa_watch_link: isWatched,
        aa_status_override: aaStatusType,
        aa_open_date: appsOpen
          ? (startDate && startDate < new Date()
              ? startDate
              : new Date()
            ).toISOString()
          : startDate?.toISOString() ?? undefined,
        aa_deadline: deadline?.toISOString() ?? undefined,
        aa_real_release: appsOpen ? true : isRealRelease,
        aa_link: website ?? undefined,
      };

      // Make a new suggestion first
      const { data: suggestionInsert, error: insertError } = await supabaseAnon
        .from("suggestions_artist_alley")
        .insert({
          convention_year_id: yearId,
          submitted_by: user?.id ?? null,
          approval_status: "pending",
          ...aaInfo,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // checking if admin
      const isAdmin = await checkIsAdmin();
      log("isAdmin?:", isAdmin);

      if (isAdmin) {
        // Update real convention_years table
        const updates: ArtistAlleyInfoFields = {
          aa_status_override: aaStatusType,
          aa_watch_link: isWatched,
        };
        if (startDate) {
          updates.aa_open_date = startDate.toISOString();
          updates.aa_real_release = isRealRelease;
        }
        if (deadline) updates.aa_deadline = deadline.toISOString();
        if (website !== null && website.trim() !== "") {
          const cleanedWebsite = website?.trim();
          if (cleanedWebsite) {
            updates.aa_link = cleanedWebsite;
          }
        }
        if (appsOpen) {
          const openDate =
            startDate && startDate < new Date() ? startDate : new Date();
          updates.aa_open_date = openDate.toISOString();
          updates.aa_real_release = true;
        }

        await supabaseAnon
          .from("convention_years")
          .update(updates)
          .eq("id", yearId);

        // Also mark the suggestion as approved
        await supabaseAnon
          .from("suggestions_artist_alley")
          .update({
            approval_status: "approved",
            approved_by: user?.id,
            merged_at: new Date().toISOString(),
          })
          .eq("id", suggestionInsert.id);

        toast.success("Admin: change pushed through!");
      }

      // Success → reset and move to confirmation page
      setStartDate(undefined);
      setDeadline(undefined);
      setWebsite("");
      setIsRealRelease(false);
      setAppsOpen(false);
      setIsWatched(false);
      setAAStatusType("open");

      toast.success("Suggestion submitted!");
      setPage("confirmation");
    } catch (error) {
      console.error("Failed to submit update:", error);
      toast.error("Failed to submit suggestion");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <HeadersHelper
      title={`Add Artist Alley Info`}
      website={conDetails.website ?? undefined}
    >
      <div className="flex gap-2 items-baseline py-4">
        <Label className="text-sm font-medium text-primary-text mb-1">
          Artist Alley?
        </Label>
        <Select
          value={aaStatusType}
          onValueChange={(val) =>
            setAAStatusType(val as "open" | "no_aa" | "invite_only")
          }
        >
          <SelectTrigger className="text-primary-text border rounded-lg px-2 py-2 shadow-xs">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Artist Alley Exists</SelectItem>
            <SelectItem value="invite_only">Invite Only</SelectItem>
            <SelectItem value="no_aa">No Artist Alley</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {aaStatusType === "open" && (
        <>
          <div className="flex flex-col gap-1 pb-4">
            <AAWebsiteInput
              label="Application Link (or where it'll appear)"
              website={website}
              onChange={setWebsite}
              placeholder="Link"
            />
            <div className="flex flex-col ">
              <CheckField
                text="Application is open!"
                isChecked={appsOpen}
                onChange={() => setAppsOpen(!appsOpen)}
                isDisabled={isWatched}
              />
              <CheckField
                text="Watch this link"
                isChecked={isWatched}
                onChange={() => setIsWatched(!isWatched)}
                isDisabled={appsOpen}
              />
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
                <div className="flex flex-col gap-6 pb-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
                    <div className="flex flex-col">
                      <SingleDateInput
                        label="Release Date:"
                        subheader={`Or ETA when it usually opens`}
                        value={startDate}
                        onChange={setStartDate}
                        placeholder="Add open date"
                      />
                      {startDate && isFuture(startDate) && (
                        <CheckField
                          text={"Official release date"}
                          isChecked={isRealRelease}
                          onChange={() => setIsRealRelease(!isRealRelease)}
                        />
                      )}
                    </div>
                    <SingleDateInput
                      label="Deadline / Close Date:"
                      subheader={`Put the date you saw it close`}
                      value={deadline}
                      onChange={setDeadline}
                      placeholder="Add deadline"
                    />
                  </div>
                </div>

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
              </motion.div>
            )}
          </AnimatePresence>{" "}
        </>
      )}
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
              className="text-primary-text transition-all bg-rose-300 px-4 py-2 rounded-lg cursor-pointer text-xs hover:bg-rose-100 mt-2"
              onClick={async () => {
                const confirmed = confirm(
                  `Are you sure you want to wipe all Artist Alley info for ${year}?`
                );
                if (!confirmed) return;

                if (yearId && user?.id) {
                  await NukeAAInfo(yearId, user.id);
                }
              }}
            >
              Admin Action: Clear {year} AA Data
            </button>
          )}
        </div>
      </DialogFooter>
    </HeadersHelper>
  );
}
