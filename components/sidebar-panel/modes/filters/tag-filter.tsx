import { useState } from "react";
import { CheckField, FilterSection } from "./filter-helpers";
import { extraTags, topTags, useFilterStore } from "@/stores/filter-store";
import { FaCaretDown } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

// for alphabetizing nicely
function chunkIntoColumns(data: string[], columnCount: number): string[][] {
  const chunkSize = Math.ceil(data.length / columnCount);
  const columns: string[][] = Array.from({ length: columnCount }, () => []);

  data.forEach((item, index) => {
    const colIndex = Math.floor(index / chunkSize);
    columns[colIndex].push(item);
  });

  return columns;
}

export default function TagsFilter() {
  const [showExtra, setShowExtra] = useState(false);
  const tagFilter = useFilterStore((s) => s.tagFilter);
  const setTagFilter = useFilterStore((s) => s.setTagFilter);

  const selectAllTags = useFilterStore((s) => s.selectAllTags);
  const clearTagFilter = useFilterStore((s) => s.clearTagFilter);
  const tagFilterIsActive = useFilterStore((s) => s.tagFilterIsActive);

  // for sorting into alphabetical columns
  const sorted = [...extraTags].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
  const grid = chunkIntoColumns(sorted, 3);

  const toggleTag = (tag: string) => {
    const isDefault = !tagFilterIsActive();
    // if all are selected and one is selected. ONLY select that one
    if (isDefault) {
      setTagFilter([tag], false);
      return;
    }

    const selected = tagFilter.selected.includes(tag)
      ? tagFilter.selected.filter((t) => t !== tag)
      : [...tagFilter.selected, tag];

    setTagFilter(selected, tagFilter.includeUntagged);
  };

  return (
    <FilterSection
      title="Tags"
      selectAll={selectAllTags}
      deselectAll={clearTagFilter}
      filterIsActive={tagFilterIsActive()}
    >
      {/* Top Tags Section */}
      <div className="grid grid-cols-3 gap-x-2 gap-y-0">
        {topTags.map((tag) => (
          <CheckField
            key={tag}
            text={tag}
            isChecked={tagFilter.selected.includes(tag)}
            onChange={() => toggleTag(tag)}
            isMuted={tagFilterIsActive()}
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
            <div className="flex flex-row gap-x-4 w-full mb-2">
              {grid.map((column, i) => (
                <div key={i} className="flex flex-col gap-y-0.5">
                  {column.map((tag) => (
                    <CheckField
                      key={tag}
                      text={tag}
                      isChecked={tagFilter.selected.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      isMuted={tagFilterIsActive()}
                    />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CheckField
        text="Include untagged events"
        isChecked={tagFilter.includeUntagged}
        onChange={() => {
          const isDefault = !tagFilterIsActive();

          if (isDefault) {
            // first click: reset to just untagged
            setTagFilter([], true);
            return;
          }
          // normal toggle
          setTagFilter(tagFilter.selected, !tagFilter.includeUntagged);
        }}
        isMuted={tagFilterIsActive()}
      />
    </FilterSection>
  );
}
