import React from "react";
import WikipediaTextarea from "./con-details-helpers/page-1/wikipedia-textarea";
import { CON_SIZE_LABELS, ConSize } from "@/types/con-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrganizerCombobox from "./con-details-helpers/page-1/organizer-combobox";
import { CheckField } from "@/components/sidebar-panel/modes/filters/filter-helpers";
import { FormState } from "@/lib/editing/reducer-helper";
import { PageOneFormState } from "@/types/editor-types";
import ResettableFieldWrapper from "./con-details-helpers/reset-buttons";

export default function GeneralEditPage({
  queryTitle,
  state,
  setField,
  resetField,
  hasChanged,
}: {
  queryTitle: string;
  state: FormState<PageOneFormState>;
  setField: <K extends keyof PageOneFormState>(
    field: K
  ) => (value: PageOneFormState[K]) => void;
  resetField: (field: keyof PageOneFormState) => void;
  hasChanged: (field: keyof PageOneFormState) => boolean;
}) {
  const wikiRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col pt-2 pb-4 gap-2">
      {/* <h1 className="text-lg font-semibold text-primary-text">
        Section 1: General Info
      </h1> */}
      <div className="flex flex-col gap-8">
        <ResettableFieldWrapper
          label="Convention Size (Estimate):"
          hasChanged={hasChanged("conSize")}
          onReset={() => resetField("conSize")}
        >
          <Select
            value={
              state.current.conSize === null
                ? "__none__"
                : state.current.conSize
            }
            onValueChange={(val) => {
              setField("conSize")(val === "__none__" ? null : (val as ConSize));
            }}
          >
            <SelectTrigger className="text-primary-text bg-white border rounded-lg px-2 py-2 shadow-xs w-fit">
              <SelectValue placeholder="Select Convention Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Unknown</SelectItem>
              {Object.entries(CON_SIZE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ResettableFieldWrapper>

        <div className="flex flex-col gap-2 max-w-64">
          <ResettableFieldWrapper
            label="Organizer:"
            hasChanged={hasChanged("selectedOrganizer")}
            onReset={() => resetField("selectedOrganizer")}
            rightElement={
              state.current.selectedOrganizer?.name ? (
                <span className="text-green-600 text-xs text-right">
                  ✓ {state.current.selectedOrganizer.name}
                </span>
              ) : (
                <span className="text-primary-muted text-xs">
                  None Selected
                </span>
              )
            }
          >
            <OrganizerCombobox
              selectedOrganizer={state.current.selectedOrganizer}
              setSelectedOrganizer={setField("selectedOrganizer")}
              wikiRef={wikiRef}
            />
          </ResettableFieldWrapper>
        </div>

        <ResettableFieldWrapper
          label="Description:"
          hasChanged={hasChanged("description")}
          onReset={() => resetField("description")}
        >
          <WikipediaTextarea
            queryTitle={queryTitle}
            value={state.current.description}
            onChange={setField("description")}
            inputRef={wikiRef}
          />
        </ResettableFieldWrapper>

        <CheckField
          text="Con is Discontinued"
          isChecked={state.current.discontinued}
          onChange={() => setField("discontinued")(!state.current.discontinued)}
          isDiff={hasChanged("discontinued")}
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
    </div>
  );
}
