// what happens when things are dragged

import { toastAddedToList, toastAlreadyInList } from "@/lib/default-toasts";
import { useListStore } from "@/stores/list-store";
import { useScopedSelectedCardsStore } from "@/stores/page-store";
import { useDragStore, useExploreGeneralUIStore } from "@/stores/ui-store";
import { ConventionInfo, Scope } from "@/types/con-types";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import React from "react";
import Card from "../card/card";
import { log } from "@/lib/utils";

export default function DragContextWrapper({
  children,
  scope,
}: {
  children: React.ReactNode;
  scope: Scope;
}) {
  const { addToList, alreadyInList, lists } = useListStore();
  const showingNow = useListStore((s) => s.showingNow);
  const { setSelectedCon } = useScopedSelectedCardsStore(scope);
  const setActiveCon = useDragStore((s) => s.setActiveCon);
  const activeCon = useDragStore((s) => s.activeCon);

  const setShowListPanel = useExploreGeneralUIStore((s) => s.setShowListPanel);

  return (
    <DndContext
      onDragStart={({ active }) => {
        const con = active?.data?.current?.con as
          | ConventionInfo
          | null
          | undefined;
        if (scope === "explore") setShowListPanel(true);
        if (con?.specificYear) log("con has a specific year");
        setActiveCon(con ?? null);
      }}
      onDragEnd={(event) => {
        const label = lists[showingNow].label;
        if (event.over && event.over.id === "droppable" && activeCon) {
          if (alreadyInList(showingNow, activeCon)) {
            toastAlreadyInList(activeCon.name, label);
            return;
          }

          addToList(showingNow, activeCon);
          setSelectedCon(activeCon);
          toastAddedToList(activeCon.name, label);

          log("your lists: ", lists);
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
