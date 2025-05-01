import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function AAWebsiteInput({
  label,
  website,
  onChange,
  placeholder = "",
  id,
}: {
  label: string;
  website: string | null;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-row justify-between">
        <Label htmlFor={id} className="text-primary-text text-sm font-medium">
          {label}:
        </Label>
        {website && (
          <span className="text-green-600 text-xs ml-1">✓ Nice!</span>
        )}
      </div>
      <Input
        id={id}
        type="text"
        value={website ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm"
      />
    </div>
  );
}
