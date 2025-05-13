import { useFilterStore } from "@/stores/filter-store";
import { CheckField, FilterSection } from "./filter-helpers";
import {
  ArtistAlleyStatus,
  artistAlleyStatusLabels,
} from "@/types/artist-alley-types";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

export default function ArtistAlleyFilter() {
  const selectedAAStatuses = useFilterStore((s) => s.selectedAAStatuses);
  const setSelectedAAStatuses = useFilterStore((s) => s.setSelectedAAStatuses);

  const selectAllAAStatuses = useFilterStore((s) => s.selectAllAAStatuses);
  const clearAAStatusFilter = useFilterStore((s) => s.clearAAStatusFilter);
  const aaStatusFilterIsActive = useFilterStore(
    (s) => s.aaStatusFilterIsActive
  );

  const [showExtraStatuses, setShowExtraStatuses] = useState(false);

  const toggleStatus = (tag: ArtistAlleyStatus) => {
    // if all are selected and one is selected. ONLY select that one
    const isDefault = !aaStatusFilterIsActive();
    if (isDefault) {
      setSelectedAAStatuses([tag]);
      return;
    }

    if (selectedAAStatuses.includes(tag)) {
      setSelectedAAStatuses(selectedAAStatuses.filter((t) => t !== tag));
    } else {
      setSelectedAAStatuses([...selectedAAStatuses, tag]);
    }
  };

  const sectionOne: ArtistAlleyStatus[] = ["open", "waitlist"];
  const sectionTwo: ArtistAlleyStatus[] = [
    "watch_link",
    "announced",
    "expected",
  ];
  const sectionThree: ArtistAlleyStatus[] = [
    "unknown",
    "closed",
    "passed",
    "invite_only",
    "no_aa",
  ];

  return (
    <FilterSection
      title="Application Status"
      selectAll={selectAllAAStatuses}
      deselectAll={clearAAStatusFilter}
      filterIsActive={aaStatusFilterIsActive()}
    >
      <div className="space-y-2">
        <div>
          <p className="text-xs text-primary-muted mb-1">Open and Waitlist</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0">
            {sectionOne.map((tag) => (
              <CheckField
                key={tag}
                text={artistAlleyStatusLabels[tag]}
                isChecked={selectedAAStatuses.includes(tag)}
                onChange={() => toggleStatus(tag)}
                isMuted={aaStatusFilterIsActive()}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-primary-muted mb-1">Upcoming</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0">
            {sectionTwo.map((tag) => (
              <CheckField
                key={tag}
                text={artistAlleyStatusLabels[tag]}
                isChecked={selectedAAStatuses.includes(tag)}
                onChange={() => toggleStatus(tag)}
                isMuted={aaStatusFilterIsActive()}
              />
            ))}
          </div>
        </div>

        <div>
          <button
            className="flex flex-row items-center gap-0.5 px-2 text-xs text-primary-text hover:underline hover:text-primary-muted my-2 cursor-pointer"
            onClick={() => setShowExtraStatuses(!showExtraStatuses)}
          >
            <FaCaretDown
              className={`transform translate-y-[1px] transition-transform duration-200 ${
                showExtraStatuses ? "rotate-180" : "rotate-0"
              }`}
            />
            Closed and Extras
          </button>
          <AnimatePresence initial={false}>
            {showExtraStatuses && (
              <motion.div
                key="extraStatuses"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0">
                    {sectionThree.map((tag) => (
                      <CheckField
                        key={tag}
                        text={artistAlleyStatusLabels[tag]}
                        isChecked={selectedAAStatuses.includes(tag)}
                        onChange={() => toggleStatus(tag)}
                        isMuted={aaStatusFilterIsActive()}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </FilterSection>
  );
}
