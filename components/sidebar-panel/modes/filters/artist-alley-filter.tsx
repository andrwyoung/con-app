import { useFilterStore } from "@/stores/filter-store";
import { CheckField, FilterSection } from "./filter-helpers";
import {
  ArtistAlleyStatus,
  artistAlleyStatusLabels,
} from "@/types/artist-alley-types";

export default function ArtistAlleyFilter() {
  const selectedAAStatuses = useFilterStore((s) => s.selectedAAStatuses);
  const setSelectedAAStatuses = useFilterStore((s) => s.setSelectedAAStatuses);

  const selectAllAAStatuses = useFilterStore((s) => s.selectAllAAStatuses);
  const clearAAStatusFilter = useFilterStore((s) => s.clearAAStatusFilter);
  const aaStatusFilterIsActive = useFilterStore(
    (s) => s.aaStatusFilterIsActive
  );

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

  const sectionOne: ArtistAlleyStatus[] = ["open", "expected"];
  const sectionTwo: ArtistAlleyStatus[] = [
    "watch_link",
    "waitlist",
    "announced",
    "unknown",
    "closed",
    "passed",
    "invite_only",
    "no_aa",
  ];

  return (
    <FilterSection
      title="Status"
      selectAll={selectAllAAStatuses}
      deselectAll={clearAAStatusFilter}
      filterIsActive={aaStatusFilterIsActive()}
    >
      <div className="space-y-2">
        <div>
          <p className="text-xs text-primary-muted mb-1">Current & Upcoming</p>
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
          <p className="text-xs text-primary-muted mb-1">Past & Inactive</p>
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
      </div>
    </FilterSection>
  );
}
