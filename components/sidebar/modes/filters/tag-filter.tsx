import { useState } from "react";
import { CheckField, FilterSection } from "./filter-helpers";
import { extraTags, topTags, useFilterStore } from "@/stores/filter-store";
import { FaCaretDown } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

export default function TagsFilter() {
  const [showExtra, setShowExtra] = useState(false);
  const selectedTags = useFilterStore((s) => s.selectedTags);
  const setSelectedTags = useFilterStore((s) => s.setSelectedTags);

  const selectAllTags = useFilterStore((s) => s.selectAllTags);
  const clearTagFilter = useFilterStore((s) => s.clearTagFilter);
  const includeUntagged = useFilterStore((s) => s.includeUntagged);
  const setIncludeUntagged = useFilterStore((s) => s.setIncludeUntagged);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <FilterSection
      title="Tags"
      selectAll={selectAllTags}
      deselectAll={clearTagFilter}
    >
      {/* Top Tags Section */}
      <div className="grid grid-cols-3 gap-x-2 gap-y-0">
        {topTags.map((tag) => (
          <CheckField
            key={tag}
            text={tag}
            isChecked={selectedTags.includes(tag)}
            onChange={() => toggleTag(tag)}
          />
        ))}
      </div>

      {/* Extra Tags Section */}
      {extraTags.length > 0 && (
        <button
          className="flex flex-row items-center gap-0.5 px-2 text-xs text-primary-text hover:underline hover:text-primary-muted my-1 cursor-pointer"
          onClick={() => setShowExtra(!showExtra)}
        >
          <FaCaretDown
            className={`transform translate-y-[1px] transition-transform duration-200 ${
              showExtra ? "rotate-180" : "rotate-0"
            }`}
          />
          {showExtra ? "Hide Extras" : "More Tags"}
        </button>
      )}
      <AnimatePresence initial={false}>
        {showExtra && (
          <motion.div
            key="extraTags"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-y-scroll scrollbar-none"
          >
            <div className="grid grid-cols-2 gap-x-2 gap-y-0">
              {extraTags.map((tag) => (
                <CheckField
                  key={tag}
                  text={tag}
                  isChecked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CheckField
        text="Include untagged events"
        isChecked={includeUntagged}
        onChange={() => setIncludeUntagged(!includeUntagged)}
      />
    </FilterSection>
  );
}
