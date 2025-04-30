"use client";

import * as React from "react";
import { useExploreSelectedCardsStore } from "@/stores/page-store";
import DetailsPanel from "@/components/details-panel/details-panel";
import CardList from "@/components/card/card-list/card-list";
import { useExploreUIStore } from "@/stores/ui-store";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useEffect } from "react";

export default function MobileDrawer2() {
  const { showMobileDrawer, setShowMobileDrawer } = useExploreUIStore();
  const selectedCon = useExploreSelectedCardsStore((s) => s.selectedCon);
  const selectedMapItems = useExploreSelectedCardsStore(
    (s) => s.filteredFocusedEvents
  );
  const clearSelectedEvents = useExploreSelectedCardsStore(
    (s) => s.clearSelectedEvents
  );

  useEffect(() => {
    if (selectedCon) {
      setShowMobileDrawer(true);
    } else if (selectedMapItems.length > 0) {
      setShowMobileDrawer(true);
    } else {
      setShowMobileDrawer(false);
    }
  }, [selectedCon, selectedMapItems, setShowMobileDrawer]);

  const isOpen = showMobileDrawer;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        setShowMobileDrawer(open);
        if (!open) clearSelectedEvents();
      }}
    >
      <DrawerContent className="h-[70dvh] overflow-y-auto p-4">
        {selectedCon && (
          <DetailsPanel
            scope="explore"
            con={selectedCon}
            onClose={() => setShowMobileDrawer(false)}
          />
        )}

        {!selectedCon && selectedMapItems.length > 0 && (
          <CardList
            items={selectedMapItems}
            scope="explore"
            sortOption="status"
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
