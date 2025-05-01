import React from "react";
import HeadersHelper from "../editor-helpers";
import { FullConventionDetails } from "@/types/con-types";

export default function ConfirmationPage({
  conDetails,
}: {
  conDetails: FullConventionDetails;
}) {
  return (
    <HeadersHelper title={`Thanks for editing ${conDetails.name}!`}>
      <div className="text-sm">
        You can track your submission on the About Page and we&apos;ll be sure
        to get to it soon!
      </div>
    </HeadersHelper>
  );
}
