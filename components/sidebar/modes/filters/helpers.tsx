import { Checkbox } from "@/components/ui/checkbox";
import { FaCaretDown } from "react-icons/fa6";
import { FilterKey } from "../filter-mode";

interface FilterToggleButtonProps {
  filter: FilterKey;
  isActive: boolean;
  hasActiveFilters: boolean;
  toggle: () => void;
}

export default function FilterToggleButton({
  filter,
  isActive,
  hasActiveFilters,
  toggle,
}: FilterToggleButtonProps) {
  return (
    <button
      aria-pressed={isActive}
      onClick={toggle}
      className={`flex items-center gap-1 text-xs px-2 py-0.5 cursor-pointer rounded-md border text-primary-text transition-color ${
        isActive
          ? "bg-primary border-primary"
          : "bg-white hover:bg-primary-lightest border-gray-300 hover:border-primary"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          hasActiveFilters ? "bg-secondary" : "bg-transparent"
        }`}
      />
      {filter.charAt(0).toUpperCase() + filter.slice(1)}
      <FaCaretDown
        className={`size-[10px] transform translate-y-[1px] transition-transform duration-200 ${
          isActive ? "rotate-180" : "rotate-0"
        }`}
      />
    </button>
  );
}

export function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col py-2">
      <h3 className="text-xs uppercase font-semibold tracking-wide text-primary-muted mb-0.5">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function CheckField({
  text,
  isChecked,
  onChange,
}: {
  text: string;
  isChecked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none p-1 group">
      <input
        type="checkbox"
        id={`${text}-checkbox`}
        checked={isChecked}
        onChange={onChange}
        className="hidden"
      />
      <Checkbox checked={isChecked} onCheckedChange={onChange} />
      <span className="text-sm font-medium text-primary-text group-hover:text-primary-muted leading-tight">
        {text}
      </span>
    </label>
  );
}
