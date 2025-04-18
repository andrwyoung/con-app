import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { EventInfo } from "@/types/types";

export default function Draggable({
  con,
  children,
}: {
  con: EventInfo;
  children: React.ReactNode;
}) {
  const id = crypto.randomUUID();

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id,
    data: { con },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ cursor: "grab" }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
