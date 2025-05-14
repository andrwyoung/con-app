// this file is just a sanity check if we're missing anything before
// submitting a new edit to the database

import { CompleteYearInfo, NewYearInfoFields } from "@/types/suggestion-types";

export function buildCompleteYearPayload(
  data: NewYearInfoFields,
  conventionId: number
): CompleteYearInfo {
  // disable lint because we're just deconstructing to get rid of this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { is_new_year, ...cleaned } = data;

  if (!cleaned.start_date || typeof cleaned.start_date !== "string") {
    throw new Error("Missing or invalid start_date");
  }

  return {
    ...cleaned,
    start_date: cleaned.start_date,
    convention_id: conventionId,
  };
}
