import React, { useState } from "react";
import HeadersHelper from "../editor-helpers";
import {
  Convention,
  ConventionYear,
  FullConventionDetails,
} from "@/types/con-types";
import { EditorSteps } from "../edit-con-modal";
import { DialogFooter } from "@/components/ui/dialog";
import useShakeError from "@/hooks/use-shake-error";
import { Button } from "@/components/ui/button";
import { handleSubmitWrapper } from "./aa-helpers/handle-submit-wrapper";
import WikipediaTextarea from "./con-details-helpers/wikipedia-textarea";
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

export default function UpdateConDetailsPage({
  conDetails,
  setPage,
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditorSteps) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { error, shake, triggerError } = useShakeError();
  const { user, profile } = useUserStore();

  // fields that matter
  const [description, setDescription] = useState(
    conDetails.cs_description ?? ""
  );

  const isAdmin = profile?.role === "ADMIN";
  const latestYear = conDetails.convention_years.reduce((latest, current) => {
    return current.year > latest.year ? current : latest;
  });

  const handleSubmit = async () => {
    await handleSubmitWrapper({
      setSubmitting,
      setPage,
      tryBlock: async () => {
        if (description === "") {
          triggerError("Please fill in at least one field.");
          setSubmitting(false);
          throw new Error("Validation failed");
        }

        const newInfo: ConDetailsFields = {
          new_start_date: undefined,
          new_end_date: undefined,
          new_g_link: undefined,
          new_status: undefined,
          new_description: description,
          new_tags: undefined,
          new_website: undefined,
          new_social_links: undefined,
          notes: undefined,
          con_size: undefined,
          organizer: undefined,
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
            cs_description: description,
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
      <div className="flex flex-col pt-4 pb-8 gap-6">
        <WikipediaTextarea
          queryTitle={conDetails.name}
          initialValue={description}
          onChange={setDescription}
        />
        {/* 
        <div>
          <Label className="text-sm font-medium text-primary-text">Tags:</Label>
          <div className="flex flex-wrap items-center justify-center gap-y-1 gap-x-2">
            {allTags.map((tag, index) => (
              <div
                key={index}
                className="px-2 py-0.5 rounded-full bg-primary-lightest text-sm text-primary-muted"
              >
                {tag}
              </div>
            ))}
          </div>
        </div> */}
      </div>

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
        </div>
      </DialogFooter>
    </HeadersHelper>
  );
}
