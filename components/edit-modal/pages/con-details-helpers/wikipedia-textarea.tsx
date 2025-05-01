import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function WikipediaTextarea({
  label = "Convention Description",
  placeholder = "Add a short summary or background...",
  initialValue = "",
  onChange,
  queryTitle,
}: {
  label?: string;
  placeholder?: string;
  initialValue?: string;
  onChange: (val: string) => void;
  queryTitle: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [searchTerm, setSearchTerm] = useState(queryTitle);

  const fetchFromWikipedia = async () => {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          queryTitle
        )}`,
        {
          headers: {
            "User-Agent": "concaly-app (contact@concaly.app)",
          },
        }
      );
      const data = await res.json();
      if (data.extract) {
        setValue(data.extract);
        onChange(data.extract);
        toast.success("Filled from Wikipedia!");
      } else {
        toast.error("No summary found.");
      }
    } catch (err) {
      toast.error("Failed to fetch from Wikipedia.");
      console.error("Wikipedia Error:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <Label
          htmlFor="description"
          className="text-sm font-medium text-primary-text"
        >
          {label}
        </Label>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchFromWikipedia}
          className="w-fit mt-1"
        >
          Autofill from Wikipedia
        </Button>
      </div>

      <Textarea
        id="description"
        value={value}
        onChange={handleChange}
        rows={4}
        className="border rounded-lg px-3 py-2 text-sm text-primary-text"
        placeholder={placeholder}
      />
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="wiki-search"
          className="text-sm font-medium text-primary-text"
        >
          Search Wikipedia for:
        </Label>
        <Input
          type="text"
          id="wiki-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm text-primary-text"
        />
      </div>
    </div>
  );
}
