// when someone submits a suggestion, we want to keep track of
// who it was submitted by, when it was submitted and all that sort of stuff

// so this file are just helper functions to do that

import { SuggestionsMetadataFields } from "@/types/suggestion-types";

export function buildInitialMetadata(
  submittedBy: string | null
): SuggestionsMetadataFields {
  return {
    submitted_by: submittedBy,
    approval_status: "pending",
    approved_by: null,
    merged_at: null,
  };
}

// Admin metadata
export function buildApprovalMetadata(
  approvedBy: string | null
): SuggestionsMetadataFields {
  return {
    submitted_by: undefined, // leave untouched
    approval_status: "approved",
    approved_by: approvedBy,
    merged_at: new Date().toISOString(),
  };
}

export function buildRejectedMetadata(
  approvedBy: string | null
): SuggestionsMetadataFields {
  return {
    submitted_by: undefined,
    approval_status: "rejected",
    approved_by: approvedBy,
    merged_at: new Date().toISOString(),
  };
}
