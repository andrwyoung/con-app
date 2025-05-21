// PAGE 3 of edit-con-modal: this is the most complicated page.
// we can edit ALL the convention info here (except for artist alley info)

// this page itself is split into 3 parts:
// SUBPAGE 1: description and stuff <GeneralEditPage /> in general-page.tsx
// SUBPAGE 2: tags and website links <TagsWebsitePage /> in tags-website.tsx
// SUBPAGE 3: dates and location <DatesLocationPage /> in date-loc-page.tsx

import React, { JSX, useState } from "react";
import HeadersHelper from "../editor-helpers";
import {
  ConSize,
  ConStatus,
  Convention,
  FullConventionDetails,
} from "@/types/con-types";
import { EditModalState } from "../edit-con-modal";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { handleSubmitWrapper } from "../handle-submit-wrapper";
import {
  CompleteYearInfo,
  ConDetailsFields,
  NewYearInfoFields,
  SuggestionsMetadataFields,
} from "@/types/suggestion-types";
import {
  buildApprovalMetadata,
  buildInitialMetadata,
} from "@/lib/editing/approval-metadata";
import { useUserStore } from "@/stores/user-store";
import { supabaseAnon } from "@/lib/supabase/client";
import { arrayEquals, log } from "@/lib/utils";
import { toast } from "sonner";
import GeneralEditPage from "./con-details-pages/general-page";
import DatesLocationPage from "./con-details-pages/date-loc-page";
import TagsWebsitePage from "./con-details-pages/tags-website";
import { allTags } from "@/stores/filter-store";
import useShakeError from "@/hooks/use-shake-error";
import { isValidUrl } from "@/utils/url";
import { AnimatePresence, motion } from "framer-motion";
import { buildCompleteYearPayload } from "@/lib/editing/build-new-year";
import {
  pushApprovedNewYear,
  pushApprovedUpdatedYear,
} from "@/lib/editing/push-years";
import { getOrCreateOrganizerId } from "@/lib/editing/create-organizer";
import {
  PageOneFormState,
  PageThreeFormState,
  PageTwoFormState,
} from "@/types/editor-types";
import { useFormReducer } from "@/lib/editing/reducer-helper";
import { FaUndo } from "react-icons/fa";

export type updateDetailsPageMode = "general" | "dates_loc" | "tags_sites";

function EditStepButton({
  label,
  selected,
  onClick,
  changedDots,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  changedDots?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`rounded-lg border-2 flex items-center justify-center px-2 py-1 text-xs
        transition-all duration-200 text-primary-text ${
          selected
            ? "bg-primary border-secondary cursor-default"
            : "bg-primary-light border-transparent hover:bg-primary cursor-pointer "
        }`}
        onClick={onClick}
      >
        {label}
      </div>
      {changedDots && changedDots > 0 ? (
        <div className="flex flex-row gap-1 justify-center">
          {Array.from({ length: changedDots }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-secondary" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function UpdateConDetailsPage({
  conDetails,
  setPage,
  setRefreshKey,
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditModalState) => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { error, shake, triggerError } = useShakeError();
  const { user, profile } = useUserStore();

  // SECTION: fields that matter
  //
  // Page 1 reducer
  //
  const initialPageOneFields: PageOneFormState = {
    description: conDetails.cs_description ?? "",
    conSize: (conDetails.con_size as ConSize) ?? null,
    selectedOrganizer: conDetails.organizer
      ? {
          id: conDetails.organizer.organizer_id,
          name: conDetails.organizer.organizer_name,
        }
      : null,
    discontinued: conDetails.discontinued ?? false,
  };

  const {
    state: pageOneState,
    setField: setPgOneField,
    resetField: resetSinglePgOneField,
    reset: resetPgOne,
    hasChanged: hasPgOneFieldChanged,
    getChangedValues: pgOneChangedValues,
  } = useFormReducer<PageOneFormState>(initialPageOneFields, {
    selectedOrganizer: (a, b) => a?.id === b?.id && a?.name === b?.name,
  });

  //
  //
  // Page 2
  //

  // form originals
  const originalSocialLinks: string[] =
    typeof conDetails.social_links === "string"
      ? conDetails.social_links
          .split(",")
          .map((link) => link.trim())
          .filter((link) => link.length > 0)
      : [];
  const originalTags: string[] = Array.isArray(conDetails.tags)
    ? conDetails.tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && allTags.includes(tag))
    : [];

  // create the form reducer
  const initialPageTwoFields: PageTwoFormState = {
    socialLinks: originalSocialLinks,
    tags: originalTags,
    website: conDetails.website ?? "",
  };

  const {
    state: pageTwoState,
    setField: setPgTwoField,
    resetField: resetSinglePgTwoField,
    reset: resetPgTwo,
    hasChanged: hasPgTwoFieldChanged,
    getChangedValues: pgTwoChangedValues,
  } = useFormReducer<PageTwoFormState>(initialPageTwoFields, {
    socialLinks: arrayEquals,
    tags: arrayEquals,
  });

  //
  // Page 3
  //
  //
  // 8: dates
  const initialPageThreeFields: PageThreeFormState = {
    location: {
      lat: conDetails.location_lat ?? undefined,
      long: conDetails.location_long ?? undefined,
    },
    years: conDetails.convention_years.map((year) => ({
      event_status: year.event_status as ConStatus,

      year: year.year,
      start_date: year.start_date,
      end_date: year.end_date,

      venue: year.venue,
      location: year.location,

      is_new_year: false,
      convention_year_id: year.id,
    })),
  };

  function yearsDeepEqual(a: NewYearInfoFields[], b: NewYearInfoFields[]) {
    if (a.length !== b.length) return false;
    return a.every((yearA, i) => {
      const yearB = b[i];
      return (
        yearA.year === yearB.year &&
        yearA.start_date === yearB.start_date &&
        yearA.end_date === yearB.end_date &&
        yearA.venue === yearB.venue &&
        yearA.location === yearB.location &&
        yearA.event_status === yearB.event_status
      );
    });
  }

  const {
    state: pageThreeState,
    setField: setPgThreeField,
    resetField: resetSinglePgThreeField,
    reset: resetPgThree,
    getChangedValues: pgThreeChangedValues,
    hasChanged: hasPgThreeFieldChanged,
  } = useFormReducer<PageThreeFormState>(initialPageThreeFields, {
    years: yearsDeepEqual,
    location: (a, b) => a.lat === b.lat && a.long === b.long,
  });

  //
  // SECTION
  //
  // moving between pages
  const [editPagePage, setEditPagePage] =
    useState<updateDetailsPageMode>("general");

  const isAdmin = profile?.role === "ADMIN";
  const handleSubmit = async () => {
    await handleSubmitWrapper({
      setSubmitting,
      setPage,
      tryBlock: async () => {
        if (
          pageTwoState.current.website !== "" &&
          !isValidUrl(pageTwoState.current.website)
        ) {
          triggerError(
            "Please enter a valid website (must start with https://) or leave website blank"
          );
          setSubmitting(false);
          throw new Error("Validation failed");
        }

        //
        // PART 1A: figure out normal convention info
        //
        //
        const newInfo: ConDetailsFields = {
          // section 1
          con_size: hasPgOneFieldChanged("conSize")
            ? pageOneState.current.conSize
            : undefined,
          organizer_id: hasPgOneFieldChanged("selectedOrganizer")
            ? pageOneState.current.selectedOrganizer?.id ?? null
            : undefined,
          organizer_name: hasPgOneFieldChanged("selectedOrganizer")
            ? pageOneState.current.selectedOrganizer?.name ?? null
            : undefined,
          new_description: hasPgOneFieldChanged("description")
            ? pageOneState.current.description
            : undefined,
          discontinued: hasPgOneFieldChanged("discontinued")
            ? pageOneState.current.discontinued
            : undefined,

          // section 2
          new_tags: hasPgTwoFieldChanged("tags")
            ? pageTwoState.current.tags
            : undefined,
          new_social_links: hasPgTwoFieldChanged("socialLinks")
            ? pageTwoState.current.socialLinks.join(",")
            : undefined,
          new_website: hasPgTwoFieldChanged("website")
            ? pageTwoState.current.website
            : undefined,

          // section 3
          new_lat: hasPgThreeFieldChanged("location")
            ? pageThreeState.current.location.lat
            : undefined,
          new_long: hasPgThreeFieldChanged("location")
            ? pageThreeState.current.location.long
            : undefined,

          notes: undefined,
        };

        const initMetadata: SuggestionsMetadataFields = buildInitialMetadata(
          user?.id ?? null
        );

        // Make a new suggestion first
        const { data: suggestionInsert, error: insertError } =
          await supabaseAnon
            .from("suggestions_con_details")
            .insert({
              convention_id: conDetails?.id,
              ...initMetadata,
              ...newInfo,
              changed_fields: Object.keys(pgOneChangedValues()),
            })
            .select()
            .single();

        if (insertError) throw insertError;

        // PART 1B: figure out years
        //
        //
        const editedYears = pageThreeState.current.years.filter((y) => {
          if (!y.start_date) return false; // don't even consider invalid ones

          const original = conDetails.convention_years.find(
            (oy) => oy.year === y.year
          );
          if (!original) return true; // definitely new

          return (
            y.event_status !== original.event_status ||
            y.start_date !== original.start_date ||
            y.end_date !== original.end_date ||
            y.venue !== original.venue ||
            y.location !== original.location
          );
        });

        const yearSubmissionPackets: {
          yearInfo: CompleteYearInfo;
          suggestionId: string;
          isNewYear: boolean;
        }[] = [];
        for (const year of editedYears) {
          // actually inserting now
          const { data: yearSuggestionInsert, error: yearInsertError } =
            await supabaseAnon
              .from("suggestions_new_year")
              .insert({
                convention_id: conDetails.id,
                ...year,
                ...initMetadata,
              })
              .select()
              .single();
          if (yearInsertError) throw yearInsertError;

          yearSubmissionPackets.push({
            yearInfo: buildCompleteYearPayload(year, conDetails.id),
            suggestionId: yearSuggestionInsert.id,
            isNewYear: year.is_new_year,
          });
        }

        log("isAdmin?:", isAdmin, suggestionInsert);
        if (user && isAdmin) {
          const confirmed = confirm(
            `Admin: Suggestion submitted. Do you also want to write new info for ${conDetails.name}?`
          );
          if (!confirmed) return;

          // PART 2a: push new convention info up

          const conTablePayload: Partial<Convention> = {
            cs_description: newInfo.new_description,
            con_size: newInfo.con_size,
            organizer_id: newInfo.organizer_id,
            discontinued: newInfo.discontinued,

            tags: newInfo.new_tags,
            social_links: newInfo.new_social_links,
            website: newInfo.new_website,

            location_lat: newInfo.new_lat,
            location_long: newInfo.new_long,
          };

          // make a new organizer if it doesn't already exist and slap it in there
          conTablePayload.organizer_id = await getOrCreateOrganizerId({
            organizerName: newInfo.organizer_name,
            organizerId: newInfo.organizer_id ?? null,
            organizerHasChanged: hasPgOneFieldChanged("selectedOrganizer"),
          });

          // KEY SECTION: here we actually change the data in the database
          await supabaseAnon
            .from("conventions")
            .update(conTablePayload)
            .eq("id", conDetails.id);

          // Also mark the suggestion as approved
          const updatesMetadata: SuggestionsMetadataFields =
            buildApprovalMetadata(user.id);

          await supabaseAnon
            .from("suggestions_con_details")
            .update(updatesMetadata)
            .eq("id", suggestionInsert.id);

          // PART 2b: push individual years up now
          for (const packet of yearSubmissionPackets) {
            if (packet.isNewYear) {
              await pushApprovedNewYear(packet, user.id);
            } else {
              await pushApprovedUpdatedYear(packet, user.id);
            }
          }

          toast.success("Admin: change pushed through!");
        }

        setRefreshKey((prev) => prev + 1);
      },
    });
  };

  type EditPageConfig = {
    label: string;
    changedDots: number;
    resetAll: () => void;
    render: () => JSX.Element;
  };

  const EDIT_PAGE_CONFIG: Record<updateDetailsPageMode, EditPageConfig> = {
    general: {
      label: "General Info",
      changedDots: Object.keys(pgOneChangedValues()).length,
      resetAll: resetPgOne,
      render: () => (
        <GeneralEditPage
          queryTitle={conDetails.name}
          state={pageOneState}
          setField={setPgOneField}
          resetField={resetSinglePgOneField}
          hasChanged={hasPgOneFieldChanged}
        />
      ),
    },
    tags_sites: {
      label: "Tags/Links",
      changedDots: Object.keys(pgTwoChangedValues()).length,
      resetAll: resetPgTwo,
      render: () => (
        <TagsWebsitePage
          state={pageTwoState}
          setField={setPgTwoField}
          resetField={resetSinglePgTwoField}
          hasChanged={hasPgTwoFieldChanged}
        />
      ),
    },
    dates_loc: {
      label: "Dates/Location",
      changedDots: Object.keys(pgThreeChangedValues()).length,
      resetAll: resetPgThree,
      render: () => (
        <DatesLocationPage
          conId={conDetails.id}
          state={pageThreeState}
          setField={setPgThreeField}
          resetField={resetSinglePgThreeField}
          hasChanged={hasPgThreeFieldChanged}
        />
      ),
    },
  };

  const hasAnyChanges = Object.values(EDIT_PAGE_CONFIG).some(
    (config) => config.changedDots > 0
  );

  return (
    <HeadersHelper
      title={`Edit Con Details`}
      website={conDetails.website ?? undefined}
      name={conDetails.name}
      // description={`${conDetails.name}`}
    >
      <div className="flex flex-col gap-2 items-center">
        <p className="text-xs text-primary-text">Select Page (optional):</p>
        <div className="flex flex-row gap-2 items-start">
          {(
            Object.entries(EDIT_PAGE_CONFIG) as [
              updateDetailsPageMode,
              EditPageConfig
            ][]
          ).map(([mode, config]) => (
            <EditStepButton
              key={mode}
              label={config.label}
              selected={editPagePage === mode}
              onClick={() => setEditPagePage(mode)}
              changedDots={config.changedDots}
            />
          ))}
        </div>
      </div>

      <div className="bg-stone-100 px-4 py-2 rounded-lg overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={editPagePage}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col"
          >
            {EDIT_PAGE_CONFIG[editPagePage].render()}
            <button
              onClick={() => EDIT_PAGE_CONFIG[editPagePage].resetAll()}
              className={`flex flex-row gap-1 items-center self-end text-rose-400 hover:underline hover:text-rose-300 
              transition-all cursor-pointer text-xs ${
                EDIT_PAGE_CONFIG[editPagePage].changedDots > 0
                  ? "visible "
                  : "invisible"
              }`}
            >
              <FaUndo className="text-xs" />
              Reset This Page
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <DialogFooter>
        <div className="flex flex-col gap-8 mt-4">
          <div className="flex flex-col gap-2 items-center">
            <Button
              onClick={handleSubmit}
              disabled={submitting || !hasAnyChanges}
            >
              {submitting ? "Submitting..." : "Submit Update"}
            </Button>
            {error && (
              <span
                id="aa-update-error"
                className={`text-sm ${
                  shake && "animate-shake"
                } text-red-500 max-w-72 text-center`}
              >
                {error}
              </span>
            )}
          </div>
        </div>
      </DialogFooter>
    </HeadersHelper>
  );
}
