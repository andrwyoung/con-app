import { Input } from "@/components/ui/input";
import { MAX_TAGS } from "@/lib/constants";
import { allTags } from "@/stores/filter-store";
import { useRef, useState } from "react";
import { FiX } from "react-icons/fi";

type TagSelectorProps = {
  selectedTags: string[];
  setSelectedTags: (t: string[]) => void;
};
export default function TagSelector({
  selectedTags,
  setSelectedTags,
}: TagSelectorProps) {
  const maxTagsReached = selectedTags.length >= MAX_TAGS;
  const containerRef = useRef<HTMLDivElement>(null);
  const tagsInputRef = useRef<HTMLInputElement>(null);

  const [tagsQuery, setTagsQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  const filtered = allTags
    .map((tag) => tag.trim())
    .filter((tag) => !selectedTags.includes(tag)) // always exclude already selected
    .filter((tag) =>
      tagsQuery.trim() === ""
        ? true
        : tag.toLowerCase().includes(tagsQuery.toLowerCase())
    );

  return (
    <>
      <div className="max-w-36 mb-1">
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
                  if (
                    filtered[highlightedIndex] &&
                    selectedTags.length < MAX_TAGS
                  ) {
                    setSelectedTags([
                      ...selectedTags,
                      filtered[highlightedIndex],
                    ]);
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
            <p className="ml-4 text-xs text-primary-muted">Max tags reached.</p>
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
                filtered
                  .sort((a, b) => a.localeCompare(b))
                  .map((tag, index) => (
                    <div
                      key={tag}
                      onClick={() => {
                        if (selectedTags.length < MAX_TAGS) {
                          setSelectedTags([...selectedTags, tag]);
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
        {selectedTags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 bg-primary-lightest border-2 border-primary text-primary-text
            text-xs px-2 py-0.5 rounded-full"
          >
            {tag}
            <button
              onClick={() => {
                setSelectedTags(selectedTags.filter((t) => t !== tag));
              }}
              className="text-primary-text hover:text-primary-muted translate-y-[1px] cursor-pointer"
              aria-label={`Remove ${tag}`}
            >
              <FiX className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
    </>
  );
}
