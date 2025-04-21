// the sidebar itself
// it's kept intentionally light to prevent prop drilling for all the different modes
// all the logic is handled inside the modes themselves and they all talk to their global stores
import SearchBar from "../../components/sidebar-panel/searchbar";
import SearchMode from "../../components/sidebar-panel/modes/search-mode";
import {
  useExploreSelectedCardsStore,
  useSidebarStore,
} from "@/stores/sidebar-store";
import { useRouter } from "next/navigation";
import FilterMode from "../../components/sidebar-panel/modes/filter-mode";
import { useEffect, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useDragStore } from "@/stores/ui-store";
import Card from "@/components/card/card";
import { ConventionInfo } from "@/types/types";
import { useListStore } from "@/stores/use-list-store";
import { FaChevronRight } from "react-icons/fa6";
import ListPanel from "@/components/list-panel/list-panel";
import { useMapPinsStore } from "@/stores/map-store";
import { useScopedSearchStore } from "@/stores/search-store";

export type sidebarModes = "search" | "filter";

export default function Sidebar() {
  const router = useRouter();

  const { sidebarMode: mode, initialized } = useSidebarStore();
  const selectedCon = useExploreSelectedCardsStore((s) => s.selectedCon);
  const { activeCon, setActiveCon } = useDragStore();

  const { addToList, showingNow } = useListStore();
  const [isExtensionOpen, setIsExtensionOpen] = useState(false);

  const { searchState } = useScopedSearchStore("explore");

  // when you click on a con, change the url to reflect which one you click
  useEffect(() => {
    if (!initialized) return;

    if (selectedCon) {
      router.push(`/explore?con=${selectedCon.slug}`, { scroll: false });
    } else {
      router.push(`/explore`, { scroll: false });
    }
  }, [selectedCon, router, initialized]);

  // if there's a search then set mode to search
  useEffect(() => {
    if (searchState.context) {
      useSidebarStore.getState().setSidebarMode("search");
    } else {
      useSidebarStore.getState().setSidebarMode("filter");
      useMapPinsStore.getState().clearTempPins();
    }
  }, [searchState.context]);

  return (
    <DndContext
      onDragStart={({ active }) => {
        const con = active?.data?.current?.con;
        setIsExtensionOpen(true);
        setActiveCon(con ?? null);
      }}
      onDragEnd={(event) => {
        if (event.over && event.over.id === "droppable") {
          addToList(showingNow, activeCon as ConventionInfo);
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
      <div className="relative">
        <div className="flex flex-col gap-2 w-80 max-h-[calc(100vh-12rem)] border rounded-lg shadow-xl bg-white px-5 py-6">
          <SearchBar key={mode} scope={"explore"} />
          {/* <StatusDotTester /> */}
          {mode === "search" && <SearchMode scope="explore" />}
          {mode === "filter" && <FilterMode scope="explore" />}
        </div>

        <ListPanel
          isOpen={isExtensionOpen}
          draggedCon={activeCon}
          scope="explore"
        />

        <button
          onClick={() => setIsExtensionOpen((prev) => !prev)}
          className={`absolute top-4 transition-all duration-300 cursor-pointer hover:bg-primary-lightest
             bg-white border-r border-b  border-gray-200 rounded-r-lg px-2 py-8 z-1 ${
               isExtensionOpen
                 ? "left-[calc(100%+20.2rem)]"
                 : "left-[calc(100%-0.05rem)]"
             }`}
          style={{
            boxShadow: "4px 2px 4px -2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <span className="rotate-90 origin-center text-sm tracking-wide">
            <FaChevronRight className={isExtensionOpen ? "rotate-180" : ""} />
          </span>
        </button>
      </div>
    </DndContext>
  );
}
