import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Label } from "../ui/label";

export default function HeadersHelper({
  children,
  title,
  website,
  description,
}: {
  children: React.ReactNode;
  title: string;
  website?: string;
  description?: string;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {website && (
            <>
              <span className="block mb-0.5">
                Website on file:{" "}
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-text underline hover:text-primary-darker"
                >
                  {website}
                </a>
              </span>
            </>
          )}
          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4 w-full">{children}</div>
    </>
  );
}

export function DateRangeInput({
  label,
  value,
  onChange,
  placeholder = "Select a date range",
}: {
  label?: string;
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
}) {
  const formatRangeLabel = () => {
    if (!value?.from) return placeholder;
    if (value.from && value.to) {
      return `${format(value.from, "MMM d")} – ${format(value.to, "MMM d")}`;
    }
    return format(value.from, "MMM d");
  };

  return (
    <Popover>
      {label && <Label>{label}</Label>}
      <PopoverTrigger
        className={`min-w-128 flex flex-row w-full justify-between items-baseline text-left font-normal cursor-pointer border rounded-lg px-4 py-2 gap-4 ${
          !value ? "text-muted-foreground" : ""
        }`}
      >
        {formatRangeLabel()}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="range" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}

export function SingleDateInput({
  label,
  subheader,
  value,
  onChange,
  placeholder = "Select a date",
  encouragement = "Nice!",
}: {
  label: string;
  subheader?: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  encouragement?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-full gap-2 py-2">
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-between">
            <Label className="text-primary-text">{label}</Label>
            {value && (
              <span className="text-green-600 text-xs ml-1">
                ✓ {encouragement}
              </span>
            )}
          </div>
          <span className="text-xs text-primary-muted">{subheader}</span>
        </div>
        <PopoverTrigger
          className={`flex flex-row justify-between items-center text-left font-normal 
            cursor-pointer border-1 rounded-lg px-4 py-2 gap-4 text-sm ${
              !value ? "text-primary-muted" : ""
            }`}
        >
          {value ? format(value, "MMM d, yyyy") : <span>{placeholder}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value ?? new Date()}
            onSelect={(selected) => {
              onChange(selected);
              if (selected) {
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
