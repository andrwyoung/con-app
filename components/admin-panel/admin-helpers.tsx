export function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-start text-xs border-t border-secondary first:hidden" />
      <div className="flex gap-4 text-xs px-4">
        <span className="font-bold w-16">{label}</span>
        <p>{children}</p>
      </div>
    </>
  );
}
