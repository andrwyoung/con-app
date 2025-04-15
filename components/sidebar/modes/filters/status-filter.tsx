import { useFilterStore } from "@/stores/filter-store";
import { CheckField, FilterSection } from "./filter-helpers";
import {
  TIME_CATEGORY_LABELS,
  TimeCategory,
} from "@/lib/helpers/event-recency";

export default function StatusFilter() {
  const selectedStatuses = useFilterStore((s) => s.selectedStatuses);
  const setSelectedStatuses = useFilterStore((s) => s.setSelectedStatuses);

  const selectAllStatuses = useFilterStore((s) => s.selectAllStatuses);
  const clearStatusFilter = useFilterStore((s) => s.clearStatusFilter);

  const toggleStatus = (tag: string) => {
    if (selectedStatuses.includes(tag)) {
      setSelectedStatuses(selectedStatuses.filter((t) => t !== tag));
    } else {
      setSelectedStatuses([...selectedStatuses, tag]);
    }
  };

  const sectionOne: TimeCategory[] = ["here", "soon", "upcoming"];
  const sectionTwo: TimeCategory[] = [
    "recent",
    "past",
    "postponed",
    "cancelled",
    "discontinued",
    "unknown",
  ];

  return (
    <FilterSection
      title="Status"
      selectAll={selectAllStatuses}
      deselectAll={clearStatusFilter}
    >
      <div className="space-y-2">
        <div>
          <p className="text-xs text-primary-muted mb-1">Current & Upcoming</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0">
            {sectionOne.map((tag) => (
              <CheckField
                key={tag}
                text={TIME_CATEGORY_LABELS[tag]}
                isChecked={selectedStatuses.includes(tag)}
                onChange={() => toggleStatus(tag)}
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
                text={TIME_CATEGORY_LABELS[tag]}
                isChecked={selectedStatuses.includes(tag)}
                onChange={() => toggleStatus(tag)}
              />
            ))}
          </div>
        </div>
      </div>
    </FilterSection>
  );
}
