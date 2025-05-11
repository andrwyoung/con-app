import React from "react";
import WikipediaTextarea from "./con-details-helpers/wikipedia-textarea";
import { CON_SIZE_LABELS, ConSize, OrganizerType } from "@/types/con-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import OrganizerCombobox from "./con-details-helpers/organizer-combobox";

export default function GeneralEditPage({
  queryTitle,
  description,
  setDescription,
  conSize,
  setConSize,
  selectedOrganizer,
  setSelectedOrganizer,
}: {
  queryTitle: string;
  description: string;
  setDescription: (d: string) => void;
  conSize: ConSize | undefined;
  setConSize: (c: ConSize | undefined) => void;
  selectedOrganizer: OrganizerType | null;
  setSelectedOrganizer: (c: OrganizerType | null) => void;
}) {
  const wikiRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col pt-4 pb-8 gap-6">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-primary-text">
          Convention Size (Estimate):
        </Label>
        <Select
          value={conSize ?? "__none__"}
          onValueChange={(val) => {
            setConSize(val === "__none__" ? undefined : (val as ConSize));
          }}
        >
          <SelectTrigger className="text-primary-text border rounded-lg px-2 py-2 shadow-xs w-fit">
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
      </div>

      <div className="flex flex-col gap-2 max-w-64">
        <div className="flex flex-row gap-4 justify-between items-center">
          <Label className="text-sm font-medium text-primary-text">
            Organizer:
          </Label>
          {selectedOrganizer ? (
            <span className="text-green-600 text-xs ml-1 text-right">
              ✓ {selectedOrganizer.name}
            </span>
          ) : (
            <span className="text-primary-muted text-xs ml-1 text-right">
              None Selected
            </span>
          )}
        </div>
        <OrganizerCombobox
          selectedOrganizer={selectedOrganizer}
          setSelectedOrganizer={setSelectedOrganizer}
          wikiRef={wikiRef}
        />
      </div>

      <WikipediaTextarea
        queryTitle={queryTitle}
        initialValue={description}
        onChange={setDescription}
        inputRef={wikiRef}
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
  );
}
