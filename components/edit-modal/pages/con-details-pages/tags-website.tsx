import { Input } from "@/components/ui/input";
import { MAX_TAGS, MAX_WEBSITES } from "@/lib/constants";
import { FormState } from "@/lib/editing/reducer-helper";
import { PageTwoFormCurrent } from "@/types/editor-types";
import { isValidUrl } from "@/utils/url";
import React from "react";
import TagSelector from "./page-2/tags-selecter";
import AddMoreLinks from "./page-2/add-more-links";
import ResettableFieldWrapper from "./con-details-helpers/reset-buttons";

export default function TagsWebsitePage({
  state,
  setField,
  resetField,
  hasChanged,
}: {
  state: FormState<PageTwoFormCurrent>;
  setField: <K extends keyof PageTwoFormCurrent>(
    field: K
  ) => (value: PageTwoFormCurrent[K]) => void;
  resetField: (field: keyof PageTwoFormCurrent) => void;
  hasChanged: (field: keyof PageTwoFormCurrent) => boolean;
}) {
  const linksInputRef = React.useRef<HTMLInputElement>(null);
  const websiteInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-12 py-4">
      <ResettableFieldWrapper
        label={`Tags (Max ${MAX_TAGS}):`}
        hasChanged={hasChanged("tags")}
        onReset={() => resetField("tags")}
      >
        <TagSelector
          selectedTags={state.current.tags}
          setSelectedTags={setField("tags")}
        />
      </ResettableFieldWrapper>

      <ResettableFieldWrapper
        label={`Website:`}
        hasChanged={hasChanged("website")}
        onReset={() => resetField("website")}
        rightElement={
          state.current.website &&
          (isValidUrl(state.current.website) ? (
            <span className="text-green-600 text-xs ml-1 text-right">
              ✓ Nice!
            </span>
          ) : (
            <span className="text-red-500  text-xs ml-1">
              ✗ Please enter a valid URL (starts with https://)
            </span>
          ))
        }
      >
        <Input
          value={state.current.website}
          ref={websiteInputRef}
          onChange={(e) => setField("website")(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              linksInputRef.current?.focus();
            } else if (e.key === "Escape") {
              e.preventDefault();
              websiteInputRef.current?.blur();
            }
          }}
          className="bg-white"
        />
      </ResettableFieldWrapper>

      {/* Other Websites */}

      <ResettableFieldWrapper
        label={`Extra Links (Max ${MAX_WEBSITES}):`}
        hasChanged={hasChanged("socialLinks")}
        onReset={() => resetField("socialLinks")}
      >
        <AddMoreLinks
          selectedLinks={state.current.socialLinks}
          setSelectedLinks={setField("socialLinks")}
          linksInputRef={linksInputRef}
        />
      </ResettableFieldWrapper>
    </div>
  );
}
