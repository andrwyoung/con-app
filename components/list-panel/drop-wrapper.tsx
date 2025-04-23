import { useListStore } from "@/stores/list-store";
import { useDragStore, useScopedUIStore } from "@/stores/ui-store";
import { Scope } from "@/types/types";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({
  children,
  scope,
}: {
  children: React.ReactNode;
  scope: Scope;
}) {
  const { showingNow } = useScopedUIStore(scope);
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
