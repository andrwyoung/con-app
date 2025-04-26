// give the ability for something to be dragged

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { ConventionInfo } from "@/types/types";
import { v4 as uuidv4 } from "uuid";

export default function Draggable({
  con,
  children,
}: {
  con: ConventionInfo;
  children: React.ReactNode;
}) {
  const id = uuidv4();

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
