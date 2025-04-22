// the sidebar itself
// it's kept intentionally light to prevent prop drilling for all the different modes
// all the logic is handled inside the modes themselves and they all talk to their global stores
import SearchBar from "../../components/sidebar-panel/searchbar";
import SearchMode from "../../components/sidebar-panel/modes/search-mode";
import {
  useExploreSelectedCardsStore,
  useExploreSidebarStore,
} from "@/stores/sidebar-store";
import { useRouter } from "next/navigation";
import FilterMode from "../../components/sidebar-panel/modes/filter-mode";
import { useEffect } from "react";
import { useDragStore, useExploreUIStore } from "@/stores/ui-store";
import { FaChevronRight } from "react-icons/fa6";
import ListPanel from "@/components/list-panel/list-panel";
import { useMapPinsStore } from "@/stores/map-store";
import { useScopedSearchStore } from "@/stores/search-store";
import { AnimatePresence, motion } from "framer-motion";
import { useEventStore } from "@/stores/all-events-store";
import DragContextWrapper from "@/components/sidebar-panel/drag-context-wrapper";

export type sidebarModes = "search" | "filter";

export default function Sidebar() {
  const router = useRouter();

  const sidebarMode = useExploreSidebarStore((s) => s.sidebarMode);
  const selectedCon = useExploreSelectedCardsStore((s) => s.selectedCon);
  const { activeCon } = useDragStore();

  const initialized = useEventStore((s) => s.initialized);

  const { showListPanel, setShowListPanel } = useExploreUIStore();

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
        <div className="flex flex-col gap-2 w-80 max-h-[calc(100vh-12rem)] border rounded-lg shadow-xl bg-white px-5 py-6">
          <SearchBar key={sidebarMode} scope={"explore"} />
          {/* <StatusDotTester /> */}
          {sidebarMode === "search" && <SearchMode scope="explore" />}
          {sidebarMode === "filter" && <FilterMode scope="explore" />}
        </div>

        <AnimatePresence initial={false}>
          {showListPanel && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { duration: 0.5, ease: "easeOut" },
              }}
              exit={{
                x: -50,
                opacity: 0,
                transition: { duration: 0.25, ease: "easeIn" },
              }}
              className="origin-left flex flex-col absolute top-0 left-[calc(100%+0.6rem)] gap-2 -z-2"
            >
              <div className="flex">
                <div className="border rounded-lg shadow-xl  px-5 py-6 w-80 bg-white">
                  <ListPanel draggedCon={activeCon} scope="explore" />
                </div>

                <button
                  title="Close List Panel"
                  onClick={() => setShowListPanel(false)}
                  className="absolute top-4 transition-all duration-300 cursor-pointer hover:bg-primary-lightest hover:text-primary-darker
                bg-secondary-light border-r border-b left-[calc(100%-0.05rem)] border-secondary hover:border-primary rounded-r-lg px-2 py-8 z-1"
                  style={{ boxShadow: "4px 2px 4px -2px rgba(0, 0, 0, 0.1)" }}
                >
                  <FaChevronRight className="rotate-180 " />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showListPanel && (
          <button
            title="Open List Panel"
            onClick={() => setShowListPanel(true)}
            className="absolute top-4 transition-all duration-300 cursor-pointer hover:bg-secondary-lightest hover:text-secondary
            bg-primary-light border-r border-b left-[calc(100%-0.05rem)] border-primary hover:border-secondary rounded-r-lg px-2 py-8 z-1"
            style={{ boxShadow: "4px 2px 4px -2px rgba(0, 0, 0, 0.1)" }}
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </DragContextWrapper>
  );
}
