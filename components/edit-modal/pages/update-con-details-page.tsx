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

export type updateDetailsPageMode = "general" | "dates_loc" | "tags_sites";

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

  // fields that matter
  const [description, setDescription] = useState(
    conDetails.cs_description ?? ""
  );
  const [conSize, setConSize] = useState<ConSize | undefined>(
    (conDetails.con_size as ConSize) ?? undefined
  );
  const [selectedOrganizer, setSelectedOrganizer] =
    useState<OrganizerType | null>(
      conDetails.organizer
        ? {
            id: conDetails.organizer.organizer_id,
            name: conDetails.organizer.organizer_name,
          }
        : null
    );

  // moving between pages
  const [editPagePage, setEditPagePage] =
    useState<updateDetailsPageMode>("general");
  console.log(setEditPagePage);

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
          new_start_date: undefined,
          new_end_date: undefined,
          new_g_link: undefined,
          new_status: undefined,

          new_description:
            description !== conDetails.cs_description ? description : undefined,

          new_tags: undefined,
          new_website: undefined,
          new_social_links: undefined,
          notes: undefined,

          con_size: conSize !== conDetails.con_size ? conSize : undefined,
          organizer_id:
            (selectedOrganizer?.id ?? null) !==
            conDetails.organizer?.organizer_id
              ? selectedOrganizer?.id ?? null
              : undefined,
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

          const conTablePayload: Partial<Convention> = {
            cs_description: newInfo.new_description,
            con_size: newInfo.con_size,
            organizer_id: newInfo.organizer_id,
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
      title={`Edit Details for ${conDetails.name}`}
      website={conDetails.website ?? undefined}
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
        />
      )}

      <DialogFooter>
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
      </DialogFooter>
    </HeadersHelper>
  );
}
