import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FaLink, FaWikipediaW } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function WikipediaTextarea({
  label = "Description",
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

  const [wikiLink, setWikiLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchFromWikipedia = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/wiki-summary", {
        method: "POST",
        body: JSON.stringify({ title: searchTerm }),
      });
      const data = await res.json();

      if (data) {
        setValue(data.extract);
        onChange(data.extract);
        setWikiLink(data.url);
        toast.success("Filled from Wikipedia!");
      } else {
        toast.error("No summary found.");
      }
    } catch (err) {
      toast.error("Failed to fetch from Wikipedia.");
      console.error("Wikipedia Error:", err);
    } finally {
      setSubmitting(false);
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
      </div>

      <Textarea
        id="description"
        value={value}
        onChange={handleChange}
        rows={4}
        autoFocus
        className="border rounded-lg px-3 py-2 text-sm text-primary-text"
        placeholder={placeholder}
      />

      <div
        className="flex flex-col gap-1 text-sm text-muted-foreground px-4 
      bg-primary-lightest rounded-lg py-2"
      >
        <label
          htmlFor="wiki-search"
          className="text-xs text-primary-text font-medium"
        >
          Try searching Wikipedia:
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchFromWikipedia();
          }}
          className="flex flex-row justify-end gap-2 items-center"
        >
          <div className="relative flex-grow">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-input
            pointer-events-none"
            />
            <input
              type="text"
              id="wiki-search"
              value={searchTerm}
              placeholder="Search Wikipedia..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 bg-white py-1 border ring-ring text-sm text-primary-text rounded-lg w-full
                focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className={`border-2 px-2 py-1 border-secondary
           text-sm rounded-lg flex flex-row gap-1 items-center ${
             submitting
               ? "bg-secondary-light text-primary-muted"
               : "cursor-pointer hover:bg-secondary-light bg-primary-lightest text-primary-text"
           }`}
            disabled={submitting}
          >
            <FaWikipediaW className="h-4 w-4 translate-y-[1px]" />
            Auto-Fill
          </button>
          {wikiLink && wikiLink.trim() != "" && (
            <a
              href={wikiLink}
              target="_blank"
              title={`${queryTitle} Wiki link`}
            >
              <FaLink className="h-4 w-4 text-primary-text" />
            </a>
          )}
        </form>
      </div>
    </div>
  );
}
