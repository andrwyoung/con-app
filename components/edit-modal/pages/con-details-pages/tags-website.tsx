import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_TAGS, MAX_WEBSITES } from "@/lib/constants";
import { allTags } from "@/stores/filter-store";
import { isValidUrl } from "@/utils/url";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";

export default function TagsWebsitePage({
  socialLinks,
  setSocialLinks,
  tags,
  setTags,
}: {
  socialLinks: string[];
  setSocialLinks: (links: string[]) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}) {
  const [tagsQuery, setTagsQuery] = useState("");
  const [linksQuery, setLinksQuery] = useState("");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const tagsInputRef = React.useRef<HTMLInputElement>(null);
  const linksInputRef = React.useRef<HTMLInputElement>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const filtered = allTags
    .map((tag) => tag.trim())
    .filter((tag) => !tags.includes(tag)) // always exclude already selected
    .filter((tag) =>
      tagsQuery.trim() === ""
        ? true
        : tag.toLowerCase().includes(tagsQuery.toLowerCase())
    );

  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [linkError, setLinkError] = useState<string | null>(null);

  const maxTagsReached = tags.length >= MAX_TAGS;

  const tryAddLink = () => {
    const trimmed = linksQuery.trim();

    if (!trimmed) return;

    if (!isValidUrl(trimmed)) {
      setLinkError("Please enter a valid URL (must start with https://)");
      return;
    }

    if (socialLinks.includes(trimmed)) {
      setLinkError("You’ve already added this link.");
      return;
    }

    setSocialLinks([...socialLinks, trimmed]);
    setLinksQuery("");
    setLinkError(null);
  };

  return (
    <div className="flex flex-col gap-12 py-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col ">
          <Label>{`Tags (Max ${MAX_TAGS}):`}</Label>
          <p className="text-xs text-primary-muted">
            Request new tags in the Notes section
          </p>
        </div>
        <div className="max-w-36">
          <div className="relative w-full text-primary-text" ref={containerRef}>
            {!maxTagsReached ? (
              <Input
                type="text"
                value={tagsQuery}
                ref={tagsInputRef}
                onChange={(e) => {
                  setTagsQuery(e.target.value);
                  setDropdownOpen(true);
                  setHighlightedIndex(0);
                }}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => {
                  setTimeout(() => {
                    if (
                      containerRef.current &&
                      !containerRef.current.contains(document.activeElement)
                    ) {
                      setDropdownOpen(false);
                    }
                  }, 200);
                }}
                onKeyDown={(e) => {
                  if (!dropdownOpen) return;

                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                      prev < filtered.length - 1 ? prev + 1 : prev
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (filtered[highlightedIndex] && tags.length < MAX_TAGS) {
                      setTags([...tags, filtered[highlightedIndex]]);
                    }

                    setHighlightedIndex(0);
                    setDropdownOpen(true); // keep it open for more adding
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    tagsInputRef.current?.blur();
                    setDropdownOpen(false);
                  }
                }}
                disabled={maxTagsReached}
                placeholder={
                  maxTagsReached ? "Max Tags Reached" : "Search tags..."
                }
                className={`w-full px-3 py-2 border rounded-md text-sm pr-6 bg-white
                transition-all focus:outline-none focus:ring-3 focus:ring-ring/50 ${
                  maxTagsReached ? "cursor-not-allowed" : "cursor-text"
                }`}
              />
            ) : (
              <p className="ml-4 text-xs text-primary-muted">
                Max tags reached.
              </p>
            )}

            {tagsQuery && (
              <button
                type="button"
                onClick={() => {
                  setTagsQuery("");
                  setDropdownOpen(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}

            {dropdownOpen && (
              <div
                className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow max-h-48 overflow-auto
              scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-light scrollbar-track-transparent"
              >
                {filtered.length > 0 ? (
                  filtered.map((tag, index) => (
                    <div
                      key={tag}
                      onClick={() => {
                        if (tags.length < MAX_TAGS) {
                          setTags([...tags, tag]);
                          setTagsQuery("");
                          setDropdownOpen(true); // stays open for more adds
                        }
                      }}
                      className={`
                            px-3 py-2 text-sm cursor-pointer transition-all duration-75
                            ${
                              index === highlightedIndex
                                ? "bg-primary-lightest text-primary-text"
                                : "hover:bg-primary-lightest"
                            }
                        `}
                    >
                      {tag}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No tags found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-primary-lightest border-2 border-primary text-primary-text
            text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
              <button
                onClick={() => {
                  setTags(tags.filter((t) => t !== tag));
                }}
                className="text-primary-text hover:text-primary-muted translate-y-[1px] cursor-pointer"
                aria-label={`Remove ${tag}`}
              >
                <FiX className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>{`Extra Links (Max ${MAX_WEBSITES}):`}</Label>

        <div className="flex flex-col gap-1 max-w-72">
          {socialLinks.map((link, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-primary-text
                text-sm overflow-hidden whitespace-nowrap text-ellipsis"
            >
              <button
                onClick={() =>
                  setSocialLinks(socialLinks.filter((_, index) => index !== i))
                }
                className="text-primary-text hover:text-primary-muted translate-y-[1px] cursor-pointer"
                aria-label={`Remove ${link}`}
              >
                <FiX className="w-4 h-4" />
              </button>
              <a
                className="truncate hover:text-primary-muted hover:underline cursor-pointer"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link}
              </a>
            </span>
          ))}
        </div>

        {socialLinks.length < MAX_WEBSITES ? (
          <div className="flex flex-col gap-1">
            <div className="flex gap-3 items-center">
              <Input
                type="text"
                placeholder="https://example.com"
                value={linksQuery}
                ref={linksInputRef}
                onChange={(e) => {
                  setLinksQuery(e.target.value);
                  setLinkError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    tryAddLink();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    linksInputRef.current?.blur();
                    setDropdownOpen(false);
                  }
                }}
                className="w-full px-3 border rounded-md text-sm bg-white 
            focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
              <button
                type="button"
                onClick={tryAddLink}
                className="rounded-md px-4 py-1 text-sm text-primary-text 
                transition-all bg-primary hover:bg-primary-light cursor-pointer
                whitespace-nowrap outline-2 outline-primary "
              >
                Add Link
              </button>
            </div>
            {linkError && (
              <p className="text-xs text-rose-500 mx-2">{linkError}</p>
            )}
          </div>
        ) : (
          <p className="ml-4 text-xs text-primary-muted">Max links reached.</p>
        )}
      </div>
    </div>
  );
}
