import { Checkbox } from "@/components/ui/checkbox";

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
