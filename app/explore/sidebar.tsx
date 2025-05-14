// the sidebar itself
// it's kept intentionally light to prevent prop drilling for all the different modes
// all the logic is handled inside the modes themselves and they all talk to their global stores
import SearchBar from "../../components/sidebar-panel/searchbar";
import SearchMode from "../../components/sidebar-panel/modes/search-mode";
import {
  useExploreSelectedCardsStore,
  useExploreSidebarStore,
} from "@/stores/page-store";
import { useRouter } from "next/navigation";
import FilterMode from "../../components/sidebar-panel/modes/filter-mode";
import { useEffect } from "react";
import { useExploreGeneralUIStore, useModalUIStore } from "@/stores/ui-store";
import ListPanel from "@/components/list-panel/list-panel";
import { useMapPinsStore } from "@/stores/map-store";
import { useScopedSearchStore } from "@/stores/search-store";
import { useEventStore } from "@/stores/all-events-store";
import DragContextWrapper from "@/components/sidebar-panel/drag-context-wrapper";
import PanelBackground from "@/components/sidebar-background";
import ListWrapper from "@/components/list-panel/list-wrapper";
import SidebarToggleButton from "@/components/list-panel/toggle-button";
import { FaPlus } from "react-icons/fa6";

export type sidebarModes = "search" | "filter";

export default function Sidebar() {
  const router = useRouter();

  const sidebarMode = useExploreSidebarStore((s) => s.sidebarMode);
  const selectedCon = useExploreSelectedCardsStore((s) => s.selectedCon);
  const filteredFocusedEvents = useExploreSelectedCardsStore(
    (s) => s.filteredFocusedEvents
  );

  const setShownFilters = useExploreGeneralUIStore((s) => s.setShownFilters);
  const shownFilters = useExploreGeneralUIStore((s) => s.shownFilters);

  const initialized = useEventStore((s) => s.initialized);

  const { showListPanel, setShowListPanel } = useExploreGeneralUIStore();
  const setEditModalState = useModalUIStore((s) => s.setEditModalState);

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
      useExploreSidebarStore.getState().setSidebarMode("search");
    } else {
      useExploreSidebarStore.getState().setSidebarMode("filter");
      useMapPinsStore.getState().clearTempPins();
    }
  }, [searchState.context]);

  return (
    <DragContextWrapper scope={"explore"}>
      <div className="relative">
        <PanelBackground />
        <div
          className={`flex flex-col gap-2 w-screen md:w-86  md:max-h-[calc(100dvh-13rem)] border-none md:border rounded-b-sm md:rounded-lg shadow-xl bg-white px-4 pt-5 pb-3 md:py-6 
         ${
           sidebarMode === "search"
             ? "outline-2 outline-primary h-screen-dvh"
             : ""
         }`}
        >
          <div
            className={
              filteredFocusedEvents.length > 0 ? "hidden md:block" : "block"
            }
          >
            <SearchBar key={sidebarMode} scope="explore" />
          </div>

          {/* <StatusDotTester /> */}
          {sidebarMode === "search" && <SearchMode scope="explore" />}
          {sidebarMode === "filter" && <FilterMode scope="explore" />}
        </div>

        <div className="hidden lg:block">
          <ListWrapper
            setShowListPanel={setShowListPanel}
            showListPanel={showListPanel}
          >
            <div className="relative border rounded-lg shadow-xl  px-5 py-6 w-86 bg-white">
              <PanelBackground />
              <ListPanel scope="explore" />
            </div>
          </ListWrapper>

          <button
            className="absolute left-1/2 top-[calc(100%-0.02rem)] translate-x-[-50%] transition-all duration-200 
            text-secondary-darker border-b-2 border-r-2 border-l-2 border-transparent
          h-8 rounded-b-lg w-78 shadow-lg text-sm bg-secondary-lightest cursor-pointer 
          hover:bg-secondary-light hover:border-secondary flex flex-row items-center justify-center gap-1"
            onClick={() => setEditModalState({ type: "new_con" })}
          >
            <FaPlus className="text-xs" />
            Add a Convention
          </button>

          {!showListPanel && (
            <SidebarToggleButton
              title="Open List Panel"
              onClick={() => setShowListPanel(true)}
            />
          )}
        </div>

        {shownFilters.length > 0 && (
          <button
            onClick={() => setShownFilters([])}
            className="block md:hidden w-full py-2 text-sm font-medium text-primary-text bg-primary-lightest
                    rounded-b-lg shadow-sm cursor-pointer transition z-10"
          >
            Collapse Filters
          </button>
        )}
      </div>
    </DragContextWrapper>
  );
}
