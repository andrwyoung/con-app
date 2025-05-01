import React, { useState } from "react";
import HeadersHelper from "../editor-helpers";
import { FullConventionDetails } from "@/types/con-types";
import { EditorSteps } from "../edit-con-modal";
import { DialogFooter } from "@/components/ui/dialog";
import useShakeError from "@/hooks/use-shake-error";
import { Button } from "@/components/ui/button";
import { handleSubmitWrapper } from "./aa-helpers/handle-submit-wrapper";
import WikipediaTextarea from "./con-details-helpers/wikipedia-textarea";

export default function UpdateConDetailsPage({
  conDetails,
  setPage,
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditorSteps) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { error, shake, triggerError } = useShakeError();

  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    await handleSubmitWrapper({
      setSubmitting,
      setPage,
      tryBlock: async () => {
        if (true) {
          triggerError("Please fill in at least one field.");
          setSubmitting(false);
          throw new Error("Validation failed");
        }
      },
    });
  };

  return (
    <HeadersHelper
      title={`Add Convention Info`}
      website={conDetails.website ?? undefined}
    >
      <WikipediaTextarea
        queryTitle={conDetails.name}
        initialValue={description}
        onChange={setDescription}
      />

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
