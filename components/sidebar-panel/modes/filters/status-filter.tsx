import { useFilterStore } from "@/stores/filter-store";
import { CheckField, FilterSection } from "./filter-helpers";
import { tagsFilterCategories, TIME_CATEGORY_LABELS } from "@/types/time-types";

export default function StatusFilter() {
  const selectedStatuses = useFilterStore((s) => s.selectedStatuses);
  const setSelectedStatuses = useFilterStore((s) => s.setSelectedStatuses);

  const selectAllStatuses = useFilterStore((s) => s.selectAllStatuses);
  const clearStatusFilter = useFilterStore((s) => s.clearStatusFilter);
  const statusFilterIsActive = useFilterStore((s) => s.statusFilterIsActive);

  const toggleStatus = (tag: string) => {
    // if all are selected and one is selected. ONLY select that one
    const isDefault = !statusFilterIsActive();
    if (isDefault) {
      setSelectedStatuses([tag]);
      return;
    }

    if (selectedStatuses.includes(tag)) {
      setSelectedStatuses(selectedStatuses.filter((t) => t !== tag));
    } else {
      setSelectedStatuses([...selectedStatuses, tag]);
    }
  };

  return (
    <FilterSection
      title="Status"
      selectAll={selectAllStatuses}
      deselectAll={clearStatusFilter}
      filterIsActive={statusFilterIsActive()}
    >
      <div className="space-y-2">
        <div>
          {/* <p className="text-xs text-primary-muted mb-1">Current & Upcoming</p> */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-0">
            {tagsFilterCategories.map((tag) => (
              <CheckField
                key={tag}
                text={TIME_CATEGORY_LABELS[tag]}
                isChecked={selectedStatuses.includes(tag)}
                onChange={() => toggleStatus(tag)}
                isMuted={statusFilterIsActive()}
              />
            ))}
          </div>
        </div>

        {/* <div>
          <p className="text-xs text-primary-muted mb-1">Past & Inactive</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0">
            {sectionTwo.map((tag) => (
              <CheckField
                key={tag}
                text={TIME_CATEGORY_LABELS[tag]}
                isChecked={selectedStatuses.includes(tag)}
                onChange={() => toggleStatus(tag)}
                isMuted={statusFilterIsActive()}
              />
            ))}
          </div>
        </div> */}
      </div>
    </FilterSection>
  );
}
