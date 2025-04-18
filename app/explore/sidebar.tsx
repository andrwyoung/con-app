// the sidebar itself
// it's kept intentionally light to prevent prop drilling for all the different modes
// all the logic is handled inside the modes themselves and they all talk to their global stores
import SearchBar from "../../components/sidebar-panel/searchbar";
import SearchMode from "../../components/sidebar-panel/modes/search-mode";
import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { useRouter } from "next/navigation";
import FilterMode from "../../components/sidebar-panel/modes/filter-mode";
import { useEffect, useRef, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useDragStore } from "@/stores/ui-store";
import Card from "@/components/card/card";
import NavigatableCardList from "@/components/card/card-list";
import { EventInfo } from "@/types/types";
import { useDropStore } from "@/stores/use-list-store";
import Droppable from "@/components/list-panel/drop-wrapper";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa6";

export type sidebarModes = "search" | "filter";

export default function Sidebar() {
  const router = useRouter();

  const { sidebarMode: mode, selectedCon, initialized } = useSidebarStore();
  const { activeCon, setActiveCon } = useDragStore();
  const { dropList, addToDropList } = useDropStore();
  const [isExtensionOpen, setIsExtensionOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [dropList.length]);

  // when you click on a con, change the url to reflect which one you click
  useEffect(() => {
    if (!initialized) return;

    if (selectedCon) {
      router.push(`/explore?con=${selectedCon.slug}`, { scroll: false });
    } else {
      router.push(`/explore`, { scroll: false });
    }
  }, [selectedCon, router, initialized]);

  return (
    <DndContext
      onDragStart={({ active }) => {
        const con = active?.data?.current?.con;
        setIsExtensionOpen(true);
        setActiveCon(con ?? null);
      }}
      onDragEnd={(event) => {
        if (event.over && event.over.id === "droppable") {
          addToDropList(activeCon as EventInfo);
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
        <div className="flex flex-col gap-2 w-80 max-h-[calc(100vh-14rem)] border rounded-lg shadow-xl bg-white px-5 py-6">
          <SearchBar key={mode} />
          {/* <StatusDotTester /> */}
          {mode === "search" && <SearchMode />}
          {mode === "filter" && <FilterMode />}
        </div>

        <AnimatePresence>
          {isExtensionOpen && (
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
              className="origin-left flex flex-col absolute top-0 left-[calc(100%+0.4rem)] gap-2 w-80  border rounded-lg shadow-xl px-5 py-6 bg-white -z-2"
            >
              <Droppable item={activeCon ?? undefined}>
                <div className="flex flex-col px-2 gap-1 mb-4">
                  <div className="flex flex-row justify-between items-baseline">
                    <h1 className="text-primary-muted uppercase font-semibold">
                      My List
                    </h1>
                    <p className="text-xs text-primary-muted">
                      Sign in to save your lists
                    </p>
                  </div>
                  <p className="text-sm text-primary-muted">
                    Sorted by: Last Added
                  </p>
                </div>

                <div
                  ref={scrollRef}
                  className="overflow-y-auto flex-grow max-h-[calc(100vh-32rem)] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent"
                >
                  <NavigatableCardList items={dropList} />
                </div>
              </Droppable>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsExtensionOpen((prev) => !prev)}
          className={`absolute top-4 transition-all duration-300 cursor-pointer hover:bg-primary-lightest
             bg-white border-r border-gray-200 rounded-r-lg px-2 py-8 z-1 ${
               isExtensionOpen
                 ? "left-[calc(100%+20.2rem)]"
                 : "left-[calc(100%-0.05rem)]"
             }`}
        >
          <span className="rotate-90 origin-center text-sm tracking-wide">
            <FaChevronRight className={isExtensionOpen ? "rotate-180" : ""} />
          </span>
        </button>
      </div>
    </DndContext>
  );
}
