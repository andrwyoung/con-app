import React from "react";

export default function CardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent">
      <div className="flex flex-col gap-3 pr-1 m-1">{children}</div>
    </div>
  );
}
