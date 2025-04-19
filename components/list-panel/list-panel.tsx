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
  SelectSeparator,
} from "../ui/select";
import { useUserStore } from "@/stores/user-store";
import InlineEditText from "../ui/inline-edit-text";
import { MdOutlineSync } from "react-icons/md";
import { fetchUserListsFromSupabase } from "@/lib/lists/sync-lists";
import { FiTrash2 } from "react-icons/fi";
import { DEFAULT_LIST, SPECIAL_LIST_KEYS } from "@/lib/constants";
import { isSpecialListKey } from "@/lib/lists/special-list";
import { toast } from "sonner";

const NEW_ITEM_KEY = "__new__";

export default function ListPanel({
  isOpen,
  draggedCon,
}: {
  isOpen: boolean;
  draggedCon: ConventionInfo | null;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const profile = useUserStore((s) => s.profile);

  const lists = useListStore((s) => s.lists);
  const showingNow = useListStore((s) => s.showingNow);
  const setShowingNow = useListStore((s) => s.setShowingNow);
  const createList = useListStore((s) => s.createList);
  const renameList = useListStore((s) => s.renameList);
  const deleteList = useListStore((s) => s.deleteList);

  // if current list was removed somehow, fall back to "planning"
  useEffect(() => {
    const currentList = lists[showingNow];
    if (!currentList) {
      setShowingNow(DEFAULT_LIST);
    }
  }, [lists, showingNow]);

  // when new items are added, scroll to bottom
  const itemCount = lists[showingNow]?.items.length;
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [itemCount]);

  // determines naming conventions for new lists
  function handleNewList(value: string) {
    const userCreatedLists = Object.entries(lists).filter(([id]) =>
      id.startsWith(`${profile?.username}-list-`)
    );

    // Generate new list ID
    const highestId = userCreatedLists.reduce((max, [id]) => {
      const num = parseInt(id.replace(`${profile?.username}-list-`, ""), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, -1);
    const newListId = `${profile?.username}-list-${highestId + 1}`;

    // Generate smart label
    const unnamedLabelPrefix = "Unnamed List";
    const unnamedLabels = userCreatedLists
      .map(([_, list]) => list.label)
      .filter((label) => label.startsWith(unnamedLabelPrefix));

    let label = unnamedLabelPrefix;

    if (unnamedLabels.length > 0) {
      const highestSuffix = unnamedLabels.reduce((max, curr) => {
        const match = curr.match(/Unnamed List (\d+)/);
        const num = match
          ? parseInt(match[1], 10)
          : curr === "Unnamed List"
          ? 1
          : 0;
        return Math.max(max, num);
      }, 0);

      label = `${unnamedLabelPrefix} ${highestSuffix + 1}`;
    }
    createList(newListId, label);
    setShowingNow(newListId);
  }

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
            <div className="flex flex-col mb-4">
              <div className="flex flex-row justify-between items-baseline">
                <h1 className="font-bold uppercase text-sm text-primary-muted">
                  My lists
                </h1>
                <InlineEditText
                  value={lists[showingNow].label}
                  onChange={(newLabel) => renameList(showingNow, newLabel)}
                  isEditable={!isSpecialListKey(showingNow)}
                />
              </div>
              <p className="text-xs text-primary-muted mb-2">
                {profile ? `` : `Sign in to save and create new lists`}
              </p>
              <div className="flex gap-2 items-center justify-between">
                <Select
                  onValueChange={(value) => {
                    if (value === NEW_ITEM_KEY) {
                      handleNewList(value);
                    } else {
                      setShowingNow(value);
                    }
                  }}
                  value={showingNow}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>Select A List</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIAL_LIST_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {lists[key].label}
                      </SelectItem>
                    ))}
                    {profile && (
                      <>
                        <SelectSeparator />

                        {Object.entries(lists)
                          .filter(([key]) =>
                            key.startsWith(`${profile.username}-list-`)
                          )
                          .map(([key, list]) => (
                            <SelectItem key={key} value={key}>
                              {list.label}
                            </SelectItem>
                          ))}
                        <SelectItem
                          value={NEW_ITEM_KEY}
                          className="text-primary-muted"
                        >
                          + New List
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>

                {profile && (
                  <div className="flex flex-row gap-4 items-center  text-primary-muted">
                    <MdOutlineSync
                      title="Sync Lists"
                      onClick={() =>
                        fetchUserListsFromSupabase(profile.user_id)
                      }
                      className="cursor-pointer size-5"
                    />
                    {!isSpecialListKey(showingNow) && (
                      <FiTrash2
                        title="Delete Current List"
                        className="cursor-pointer size-4.5"
                        onClick={() => {
                          const deletedLabel = lists[showingNow].label;
                          const confirmed = window.confirm(
                            `Are you sure you want to delete "${deletedLabel}"?`
                          );
                          if (!confirmed) return;

                          deleteList(showingNow);
                          toast(`"${deletedLabel}" was deleted.`);
                          setShowingNow(DEFAULT_LIST);
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
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
