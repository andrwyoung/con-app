// DEPRECATED until I turn drag and drop back on
// let's people drop a convention into the list panel

import { useListStore } from "@/stores/list-store";
import { useDragStore } from "@/stores/ui-store";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({ children }: { children: React.ReactNode }) {
  const showingNow = useListStore((s) => s.showingNow);
  const draggedCon = useDragStore((s) => s.activeCon);
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const validDrop =
    draggedCon &&
    !useListStore.getState().alreadyInList(showingNow, draggedCon);

  return (
    <div ref={setNodeRef}>
      <div
        className={`absolute inset-0 z-10 m-2 pointer-events-none border-2 border-dashed rounded-lg transition-all duration-200 ${
          isOver
            ? validDrop
              ? "border-primary-darker bg-primary-lightest/50"
              : "border-primary-muted/80 bg-gray-300/50"
            : "opacity-0"
        }`}
      />
      {children}
    </div>
  );
}
