import React from "react";
import HeadersHelper from "../editor-helpers";
import { FullConventionDetails } from "@/types/types";
import { EditorSteps } from "../edit-con-modal";

export default function EditorPage({
  conDetails,
  setPage,
}: {
  conDetails: FullConventionDetails;
  setPage: (p: EditorSteps) => void;
}) {
  return (
    <HeadersHelper title={`Thanks for editing ${conDetails.name}!`}>
      <div className="flex flex-col gap-4 text-sm">
        <p>
          Your update has been submitted. We’re reviewing it and will add it to
          the con’s public page soon.
        </p>

        <button
          onClick={() => setPage("editor")}
          className="text-primary underline hover:text-primary-darker w-fit"
        >
          Want to make another edit?
        </button>
      </div>
    </HeadersHelper>
  );
}
