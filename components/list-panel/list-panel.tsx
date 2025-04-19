import { useListStore } from "@/stores/use-list-store";
import { ConventionInfo } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Droppable from "./drop-wrapper";
import CardList from "../card/card-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUserStore } from "@/stores/user-store";

export default function ListPanel({
  isOpen,
  draggedCon,
}: {
  isOpen: boolean;
  draggedCon: ConventionInfo | null;
}) {
  const { lists, showingNow, setShowingNow } = useListStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const user = useUserStore((s) => s.user);

  const itemCount = lists[showingNow]?.items.length;
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [itemCount]);

  return (
    <AnimatePresence>
      {isOpen && (
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
          className="origin-left flex flex-col absolute top-0 left-[calc(100%+0.4rem)] gap-2 w-80 border rounded-lg shadow-xl px-5 py-6 bg-white -z-2"
        >
          <Droppable item={draggedCon ?? undefined}>
            <div className="flex flex-col gap-1 mb-4 px-2">
              <div className="flex flex-row justify-between items-center">
                <h1 className="text-primary-muted uppercase font-semibold">
                  My Lists
                </h1>

                <p className="text-xs text-primary-muted text-right">
                  {user ? `` : `Sign in to save your lists`}
                </p>
              </div>

              <div className="flex gap-2 items-baseline">
                <p className="text-xs">Showing:</p>
                <Select
                  onValueChange={(value) => setShowingNow(value)}
                  value={showingNow}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>{lists[showingNow].label}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(lists).map(([key, list]) => (
                      <SelectItem key={key} value={key}>
                        {list.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* 
              <p className="text-sm text-primary-muted self-end">
                Sorted by: Last Added
              </p> */}
            </div>

            <div
              ref={scrollRef}
              className="overflow-y-auto flex-grow max-h-[calc(100vh-24rem)] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent"
            >
              <CardList items={lists[showingNow].items} type="list" />
            </div>
          </Droppable>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
