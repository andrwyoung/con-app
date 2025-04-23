import { toastAddedToList, toastAlreadyInList } from "@/lib/default-toasts";
import { useListStore } from "@/stores/list-store";
import { useScopedSelectedCardsStore } from "@/stores/sidebar-store";
import {
  useDragStore,
  useExploreUIStore,
  useScopedUIStore,
} from "@/stores/ui-store";
import { cleanConventionInfo, Scope } from "@/types/types";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import React from "react";
import Card from "../card/card";

export default function DragContextWrapper({
  children,
  scope,
}: {
  children: React.ReactNode;
  scope: Scope;
}) {
  const { addToList, alreadyInList, lists } = useListStore();
  const { showingNow } = useScopedUIStore(scope);
  const { setSelectedCon } = useScopedSelectedCardsStore(scope);
  const setActiveCon = useDragStore((s) => s.setActiveCon);
  const activeCon = useDragStore((s) => s.activeCon);

  const setShowListPanel = useExploreUIStore((s) => s.setShowListPanel);

  return (
    <DndContext
      onDragStart={({ active }) => {
        const con = active?.data?.current?.con;
        if (scope === "explore") setShowListPanel(true);
        setActiveCon(con ?? null);
      }}
      onDragEnd={(event) => {
        const label = lists[showingNow].label;
        if (event.over && event.over.id === "droppable" && activeCon) {
          if (alreadyInList(showingNow, activeCon)) {
            toastAlreadyInList(activeCon.name, label);
            return;
          }
          addToList(showingNow, cleanConventionInfo(activeCon));
          setSelectedCon(activeCon);
          toastAddedToList(activeCon.name, label);
        }
        setActiveCon(null);
      }}
    >
      <DragOverlay>
        {activeCon && (
          <div className="w-68">
            <Card info={activeCon} selected type="hover" />
          </div>
        )}
      </DragOverlay>
      {children}
    </DndContext>
  );
}
