import React, { useState } from "react";
import HeadersHelper from "../editor-helpers";
import {
  ConSize,
  Convention,
  ConventionYear,
  FullConventionDetails,
  OrganizerType,
} from "@/types/con-types";
import { EditorSteps } from "../edit-con-modal";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { handleSubmitWrapper } from "./aa-helpers/handle-submit-wrapper";
import {
  ConDetailsFields,
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

export type updateDetailsPageMode = "general" | "dates_loc" | "tags_sites";
export const EDIT_PAGE_TITLES: Record<updateDetailsPageMode, string> = {
  general: "General Info",
  tags_sites: "Tags/Socials",
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
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditorSteps) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  // const { error, shake, triggerError } = useShakeError();
  const { user, profile } = useUserStore();

  // SECTION: fields that matter
  //
  // fields that matter

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
  // 4: social links
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
  // 5: tags
  const originalTags: string[] = Array.isArray(conDetails.tags)
    ? conDetails.tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && allTags.includes(tag))
    : [];
  const [tags, setTags] = useState<string[]>(originalTags);
  const tagsHaveChanged = arrayChanged(tags, originalTags);

  //
  // SECTION
  //
  // moving between pages
  const [editPagePage, setEditPagePage] =
    useState<updateDetailsPageMode>("general");

  const isAdmin = profile?.role === "ADMIN";
  const latestYear = conDetails.convention_years.reduce((latest, current) => {
    return current.year > latest.year ? current : latest;
  });

  const handleSubmit = async () => {
    await handleSubmitWrapper({
      setSubmitting,
      setPage,
      tryBlock: async () => {
        // if (description === "") {
        //   triggerError("Please fill in at least one field.");
        //   setSubmitting(false);
        //   throw new Error("Validation failed");
        // }

        const newInfo: ConDetailsFields = {
          // section 1
          con_size: conSize !== conDetails.con_size ? conSize : undefined,
          organizer_id: organizerHasChanged
            ? selectedOrganizer?.id ?? null
            : undefined,
          organizer_name: organizerHasChanged
            ? selectedOrganizer?.name ?? null
            : undefined,
          new_description: descriptionHasChanged ? description : undefined,

          // section 2
          new_tags: tagsHaveChanged ? tags : undefined,
          new_social_links: socialLinksHaveChanged
            ? cleanSocialLinks.join(",")
            : undefined,

          // section 3
          new_start_date: undefined,
          new_end_date: undefined,
          new_website: undefined,
          new_g_link: undefined,
          new_status: undefined,
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

        log("isAdmin?:", isAdmin, suggestionInsert);
        if (user && isAdmin) {
          const confirmed = confirm(
            `Admin: Suggestion submitted. Do you also want to write new info for ${conDetails.name}?`
          );
          if (!confirmed) return;

          // TODO: make new organizer

          const conTablePayload: Partial<Convention> = {
            cs_description: newInfo.new_description,
            con_size: newInfo.con_size,
            organizer_id: newInfo.organizer_id,

            tags: newInfo.new_tags,
            social_links: newInfo.new_social_links,
          };

          const conYearTablePayload: Partial<ConventionYear> = {};

          // KEY SECTION: here we actually change the data in the database
          await supabaseAnon
            .from("conventions")
            .update(conTablePayload)
            .eq("id", conDetails.id);

          await supabaseAnon
            .from("convention_years")
            .update(conYearTablePayload)
            .eq("id", latestYear?.id);

          // Also mark the suggestion as approved
          const updatesMetadata: SuggestionsMetadataFields =
            buildApprovalMetadata(user.id);

          await supabaseAnon
            .from("suggestions_con_details")
            .update(updatesMetadata)
            .eq("id", suggestionInsert.id);

          toast.success("Admin: change pushed through!");
        }
      },
    });
  };

  return (
    <HeadersHelper
      title={`Edit Con Details`}
      website={conDetails.website ?? undefined}
      description={`${conDetails.name}`}
    >
      <div className="flex flex-col gap-2 items-center">
        <p className="text-xs text-primary-text">
          Select Page (everything is optional):
        </p>
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

      <div className="bg-stone-100 px-4 py-2 rounded-lg">
        {editPagePage === "general" && (
          <GeneralEditPage
            queryTitle={conDetails.name}
            description={description}
            setDescription={setDescription}
            conSize={conSize}
            setConSize={setConSize}
            selectedOrganizer={selectedOrganizer}
            setSelectedOrganizer={setSelectedOrganizer}
          />
        )}
        {editPagePage === "tags_sites" && (
          <TagsWebsitePage
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            tags={tags}
            setTags={setTags}
          />
        )}
        {editPagePage === "dates_loc" && <DatesLocationPage />}
      </div>

      <DialogFooter>
        <div className="flex flex-col gap-8 mt-4">
          <div className="flex flex-col gap-2 items-center">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Update"}
            </Button>
            {/* {error && (
            <span
              id="aa-update-error"
              className={`text-sm ${shake && "animate-shake"} text-red-500`}
            >
              {error}
            </span>
          )} */}
          </div>
        </div>
      </DialogFooter>
    </HeadersHelper>
  );
}
