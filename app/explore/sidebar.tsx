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
import { useExploreGeneralUIStore } from "@/stores/ui-store";
import ListPanel from "@/components/list-panel/list-panel";
import { useMapPinsStore } from "@/stores/map-store";
import { useScopedSearchStore } from "@/stores/search-store";
import { useEventStore } from "@/stores/all-events-store";
import DragContextWrapper from "@/components/sidebar-panel/drag-context-wrapper";
import SidebarBackground from "@/components/sidebar-background";
import ListWrapper from "@/components/list-panel/list-wrapper";
import SidebarToggleButton from "@/components/list-panel/toggle-button";

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
        <SidebarBackground />
        <div
          className={`flex flex-col gap-2 w-screen md:w-80  md:max-h-[calc(100dvh-12rem)] border-none md:border rounded-b-sm md:rounded-lg shadow-xl bg-white px-4 pt-5 pb-3 md:py-6 
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
              <SidebarBackground />
              <ListPanel scope="explore" />
            </div>
          </ListWrapper>

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
