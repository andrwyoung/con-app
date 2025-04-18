import { useListStore } from "@/stores/use-list-store";
import { ConventionInfo } from "@/types/types";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({
  item,
  children,
}: {
  item: ConventionInfo | undefined;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const validDrop =
    item &&
    !useListStore
      .getState()
      .alreadyInList(useListStore.getState().showingNow, item);

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
