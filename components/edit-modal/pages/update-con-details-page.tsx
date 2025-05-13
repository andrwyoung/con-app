import React, { useState } from "react";
import HeadersHelper from "../editor-helpers";
import {
  ConSize,
  ConStatus,
  Convention,
  FullConventionDetails,
  OrganizerType,
} from "@/types/con-types";
import { EditModalState } from "../edit-con-modal";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { handleSubmitWrapper } from "./aa-helpers/handle-submit-wrapper";
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
import { log } from "@/lib/utils";
import { toast } from "sonner";
import GeneralEditPage from "./con-details-pages/general-page";
import DatesLocationPage from "./con-details-pages/date-loc-page";
import TagsWebsitePage from "./con-details-pages/tags-website";
import { allTags } from "@/stores/filter-store";
import { arrayChanged } from "@/utils/array-utils";
import useShakeError from "@/hooks/use-shake-error";
import { isValidUrl } from "@/utils/url";
import { AnimatePresence, motion } from "framer-motion";
import { buildCompleteYearPayload } from "@/lib/editing/build-new-year";
import {
  pushApprovedNewYear,
  pushApprovedUpdatedYear,
} from "@/lib/editing/push-years";
import { getOrCreateOrganizerId } from "@/lib/editing/create-organizer";

export type updateDetailsPageMode = "general" | "dates_loc" | "tags_sites";
export const EDIT_PAGE_TITLES: Record<updateDetailsPageMode, string> = {
  general: "General Info",
  tags_sites: "Tags/Links",
  dates_loc: "Dates/Location",
};

function EditStepButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
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
  // Page 1
  //
  // 1: description
  const [description, setDescription] = useState(
    conDetails.cs_description ?? ""
  );
  const descriptionHasChanged = description !== conDetails.cs_description;
  //
  // 2: convention size
  const [conSize, setConSize] = useState<ConSize | undefined>(
    (conDetails.con_size as ConSize) ?? undefined
  );
  const conSizeHasChanged = conSize !== conDetails.con_size;
  //
  // 3: organizer
  const originalOrganizerName = conDetails.organizer?.organizer_name ?? "";
  const [selectedOrganizer, setSelectedOrganizer] =
    useState<OrganizerType | null>(
      conDetails.organizer
        ? {
            id: conDetails.organizer.organizer_id,
            name: conDetails.organizer.organizer_name,
          }
        : null
    );
  const organizerHasChanged =
    (selectedOrganizer?.name.trim() ?? "") !== originalOrganizerName.trim();
  //
  // 4: discontinued
  const [discontinued, setDiscontinued] = useState(
    conDetails.discontinued ?? false
  );
  const discontinuedChanged =
    discontinued !== (conDetails.discontinued ?? false);
  //
  //
  // Page 2
  //
  // 5: social links
  const originalSocialLinks: string[] =
    typeof conDetails.social_links === "string"
      ? conDetails.social_links
          .split(",")
          .map((link) => link.trim())
          .filter((link) => link.length > 0)
      : [];
  const [socialLinks, setSocialLinks] = useState<string[]>(originalSocialLinks);
  const cleanSocialLinks = socialLinks.map((l) => l.trim()).filter(Boolean);
  const socialLinksHaveChanged = arrayChanged(
    cleanSocialLinks,
    originalSocialLinks
  );
  //
  // 6: tags
  const originalTags: string[] = Array.isArray(conDetails.tags)
    ? conDetails.tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && allTags.includes(tag))
    : [];
  const [tags, setTags] = useState<string[]>(originalTags);
  const tagsHaveChanged = arrayChanged(tags, originalTags);
  //
  // 7: real website
  const [website, setWebsite] = useState(conDetails.website ?? "");
  const websiteHasChanged = website !== conDetails.website;

  //
  // Page 3
  //
  // 8: dates
  const [years, setYears] = useState<NewYearInfoFields[]>(
    conDetails.convention_years.map((year) => ({
      event_status: year.event_status as ConStatus,

      year: year.year,
      start_date: year.start_date,
      end_date: year.end_date,

      g_link: year.g_link,
      venue: year.venue,
      location: year.location,

      is_new_year: false, // not new because it already exists
      convention_year_id: year.id,
    }))
  );
  //
  // 9: long / lat
  const [long, setLong] = useState(conDetails.location_long ?? undefined);
  const [lat, setLat] = useState(conDetails.location_lat ?? undefined);
  const latLongHasChanged =
    lat !== conDetails.location_lat || long !== conDetails.location_long;

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
        if (website !== "" && !isValidUrl(website)) {
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
          con_size: conSizeHasChanged ? conSize : undefined,
          organizer_id: organizerHasChanged
            ? selectedOrganizer?.id ?? null
            : undefined,
          organizer_name: organizerHasChanged
            ? selectedOrganizer?.name ?? null
            : undefined,
          new_description: descriptionHasChanged ? description : undefined,
          discontinued: discontinuedChanged ? discontinued : undefined,

          // section 2
          new_tags: tagsHaveChanged ? tags : undefined,
          new_social_links: socialLinksHaveChanged
            ? cleanSocialLinks.join(",")
            : undefined,
          new_website: websiteHasChanged ? website : undefined,

          // section 3
          new_lat: latLongHasChanged ? lat : undefined,
          new_long: latLongHasChanged ? long : undefined,

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
            })
            .select()
            .single();

        if (insertError) throw insertError;

        // PART 1B: figure out years
        //
        //
        const editedYears = years.filter((y) => {
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
            organizerId: selectedOrganizer?.id ?? null,
            organizerHasChanged,
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

  return (
    <HeadersHelper
      title={`Edit Con Details`}
      website={conDetails.website ?? undefined}
      name={conDetails.name}
      // description={`${conDetails.name}`}
    >
      <div className="flex flex-col gap-2 items-center">
        <p className="text-xs text-primary-text">Select Page (optional):</p>
        <div className="flex flex-row gap-2 items-center">
          {(
            Object.entries(EDIT_PAGE_TITLES) as [
              updateDetailsPageMode,
              string
            ][]
          ).map(([mode, label]) => (
            <EditStepButton
              key={mode}
              label={label}
              selected={editPagePage === mode}
              onClick={() => setEditPagePage(mode)}
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
          >
            {editPagePage === "general" && (
              <GeneralEditPage
                queryTitle={conDetails.name}
                description={description}
                setDescription={setDescription}
                conSize={conSize}
                setConSize={setConSize}
                selectedOrganizer={selectedOrganizer}
                setSelectedOrganizer={setSelectedOrganizer}
                discontinued={discontinued}
                setDiscontinued={setDiscontinued}
              />
            )}
            {editPagePage === "tags_sites" && (
              <TagsWebsitePage
                socialLinks={socialLinks}
                setSocialLinks={setSocialLinks}
                tags={tags}
                setTags={setTags}
                website={website}
                setWebsite={setWebsite}
              />
            )}
            {editPagePage === "dates_loc" && (
              <DatesLocationPage
                conId={conDetails.id}
                years={years}
                setYears={setYears}
                long={long}
                setLong={setLong}
                lat={lat}
                setLat={setLat}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <DialogFooter>
        <div className="flex flex-col gap-8 mt-4">
          <div className="flex flex-col gap-2 items-center">
            <Button onClick={handleSubmit} disabled={submitting}>
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
