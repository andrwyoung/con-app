import { useListStore } from "@/stores/list-store";
import { useScopedUIStore } from "@/stores/ui-store";
import { ConventionInfo, Scope } from "@/types/types";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({
  item,
  children,
  scope,
}: {
  item: ConventionInfo | undefined;
  children: React.ReactNode;
  scope: Scope;
}) {
  const { showingNow } = useScopedUIStore(scope);
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const validDrop =
    item && !useListStore.getState().alreadyInList(showingNow, item);

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
