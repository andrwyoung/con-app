// when you make a change, you want to see feedback on which fields you changed
// and also let people revert back to the original. this the helper that let's people do that
// (basically the revert, or undo button)

import { ReactNode } from "react";
import { FaUndo } from "react-icons/fa";

type ResettableFieldWrapperProps = {
  label: string;
  children: ReactNode;
  hasChanged?: boolean;
  onReset?: () => void;
  rightElement?: ReactNode;
};

export default function ResettableFieldWrapper({
  label,
  children,
  hasChanged,
  onReset,
  rightElement,
}: ResettableFieldWrapperProps) {
  const isResettable = hasChanged && onReset;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4 justify-between items-center">
        <div
          className={`flex flex-row gap-1 items-center ${
            isResettable ? "group cursor-pointer " : ""
          }`}
          onClick={isResettable ? () => onReset?.() : undefined}
        >
          {hasChanged && (
            <FaUndo className="text-secondary-darker text-xs group-hover:text-secondary" />
          )}
          <p
            className={`text-sm font-semibold ${
              hasChanged
                ? "text-secondary-darker group-hover:text-secondary"
                : "text-primary-text"
            }`}
          >
            {label}
          </p>
        </div>
        {rightElement && <>{rightElement}</>}
      </div>
      {children}
    </div>
  );
}
