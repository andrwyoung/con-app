import React from "react";
import WikipediaTextarea from "./con-details-helpers/wikipedia-textarea";
import { CON_SIZE_LABELS, ConSize } from "@/types/con-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Combobox } from "./con-details-helpers/combobox";

export default function GeneralEditPage({
  queryTitle,
  description,
  setDescription,
  conSize,
  setConSize,
}: {
  queryTitle: string;
  description: string;
  setDescription: (d: string) => void;
  conSize: ConSize | undefined;
  setConSize: (c: ConSize | undefined) => void;
}) {
  return (
    <div className="flex flex-col pt-4 pb-8 gap-6">
      <WikipediaTextarea
        queryTitle={queryTitle}
        initialValue={description}
        onChange={setDescription}
      />

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-primary-text">
          Convention Size (Estimate):
        </Label>
        <Select
          value={conSize as string}
          onValueChange={(val) => setConSize(val as ConSize)}
        >
          <SelectTrigger className="text-primary-text border rounded-lg px-2 py-2 shadow-xs w-fit">
            <SelectValue placeholder="Select Convention Size" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CON_SIZE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Combobox />

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
