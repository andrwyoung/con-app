import { FaCaretDown } from "react-icons/fa6";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { FilterKey } from "../filter-section";

interface FilterToggleButtonProps {
  filter: FilterKey;
  isShown: boolean;
  isActive: boolean;
  toggle: () => void;
}

export default function FilterToggleButton({
  filter,
  isShown,
  isActive,
  toggle,
}: FilterToggleButtonProps) {
  return (
    <button
      aria-pressed={isShown}
      onClick={toggle}
      className={`flex items-center gap-1 text-xs px-2 py-0.5 cursor-pointer rounded-md border text-primary-text transition-color ${
        isShown
          ? "bg-primary border-primary"
          : "bg-white hover:bg-primary-lightest border-gray-300 hover:border-primary"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-secondary" : "bg-transparent"
        }`}
      />
      {filter.charAt(0).toUpperCase() + filter.slice(1)}
      <FaCaretDown
        className={`size-[10px] transform translate-y-[1px] transition-transform duration-200 ${
          isShown ? "rotate-180" : "rotate-0"
        }`}
      />
    </button>
  );
}

export function FilterSection({
  title,
  children,
  selectAll,
  deselectAll,
  filterIsActive,
}: {
  title: string;
  children: React.ReactNode;
  selectAll?: () => void;
  deselectAll?: () => void;
  filterIsActive: boolean;
}) {
  return (
    <div className="flex flex-col py-2">
      <h3 className="text-xs uppercase font-semibold tracking-wide text-primary-muted mb-0.5">
        {title}:
      </h3>
      {children}

      {selectAll && deselectAll ? (
        <div className="flex flex-col self-end items-end px-2 mt-2">
          <button
            className="text-xs text-primary-muted cursor-pointer hover:underline"
            onClick={() => deselectAll()}
          >
            Select None
          </button>
          <button
            className={`text-xs  cursor-pointer hover:underline ${
              filterIsActive ? "text-rose-400" : "text-primary-muted"
            }`}
            onClick={() => selectAll()}
          >
            Reset (Select All)
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export function CheckField({
  text,
  isChecked,
  onChange,
  isMuted = false,
  isDisabled = false,
  isDiff = false,
}: {
  text: string;
  isChecked: boolean;
  onChange: () => void;
  isMuted?: boolean;
  isDisabled?: boolean;
  isDiff?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-2 select-none p-1 group ${
        isDisabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        id={`${text}-checkbox`}
        checked={isChecked}
        onChange={onChange}
        className="hidden"
        disabled={isDisabled}
      />
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={`
          peer border-input dark:bg-input/30  bg-white
          dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50
          aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-3.5 shrink-0
          rounded-[4px] border shadow-sm  transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed
          disabled:opacity-50 cursor-pointer ${
            isMuted
              ? "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              : "data-[state=checked]:bg-primary-lightest data-[state=checked]:border-primary"
          }
        `}
        id={`${text}-checkbox`}
        checked={isChecked}
        onCheckedChange={onChange}
        disabled={isDisabled}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="flex items-center justify-center text-current transition-none"
          id={`${text}-checkbox`}
        >
          {/* <FaCheck className="size-2.5 text-primary-muted" /> */}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      <span
        className={`text-sm font-medium leading-tight
          ${isDiff ? "text-secondary-darker" : ""}
          ${
            isDisabled
              ? "text-primary-muted/60"
              : "text-primary-text group-hover:text-primary-muted"
          }`}
      >
        {text}
      </span>
    </label>
  );
}
