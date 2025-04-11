import { useSidebarStore } from "@/stores/explore-sidebar-store";
import React from "react";

export default function ModeWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { setSidebarMode } = useSidebarStore();
  return (
    <>
      <div className="flex-none flex flex-row justify-between px-1 items-baseline">
        <h1 className="text-sm mt-2 font-semibold uppercase tracking-wide text-primary-muted px-1">
          {title}
        </h1>
        <button
          type="button"
          onClick={() => setSidebarMode("filter")}
          className="bg-primary-lightest cursor-pointer text-primary-muted uppercase text-xs px-4 py-1 rounded-full hover:bg-primary-light focus:outline-none"
        >
          Reset
        </button>
      </div>
      {children}
    </>
  );
}
