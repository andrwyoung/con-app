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
import { FaLink } from "react-icons/fa6";

export function FormField({
  label,
  children,
  className = "",
  mandatory = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  mandatory?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label className="text-sm font-medium text-primary-text">
        {mandatory && <span className="text-red-500">*</span>}
        {label}
      </Label>
      {children}
    </div>
  );
}

export default function HeadersHelper({
  children,
  title,
  website,
  description,
  name,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  website?: string;
  description?: string;
  name?: string;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {description && (
            <span className="text-primary-muted/80">{description}</span>
          )}
          {website ? (
            <>
              <span className="flex flex-row items-center gap-1 mb-0.5 text-primary-text hover:text-primary-darker">
                <FaLink className="h-4 w-4" />
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                >
                  {name ? name : "Website"}
                </a>
              </span>
            </>
          ) : (
            <span className="text-primary-text">{name}</span>
          )}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4 w-full">{children}</div>
    </>
  );
}

export function DateRangeInput({
  label,
  subheader,
  value,
  onChange,
  placeholder = "Select a date range",
  encouragement = "Nice!",
}: {
  label?: string;
  subheader?: string;
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  encouragement?: string;
}) {
  const [open, setOpen] = useState(false);

  const formatRangeLabel = () => {
    if (!value?.from) return placeholder;

    if (value.from && value.to) {
      return `${format(value.from, "MMM d")} – ${format(
        value.to,
        "MMM d, yyyy"
      )}`;
    }

    return format(value.from, "MMM d, yyyy");
  };

  return (
    <div className="flex flex-col w-full gap-2 py-2">
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-between">
            <Label className="text-primary-text">
              <span className="text-red-500">*</span>
              {label}
            </Label>
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
            cursor-pointer border-1 rounded-lg px-4 py-2 gap-4 text-sm bg-white ${
              !value ? "text-primary-muted" : ""
            }`}
        >
          {value ? formatRangeLabel() : <span>{placeholder}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            defaultMonth={value?.from ?? new Date()}
            onSelect={onChange}
          />
        </PopoverContent>
      </Popover>
    </div>
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
