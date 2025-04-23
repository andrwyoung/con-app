import { useListStore } from "@/stores/list-store";
import { ConventionInfo, Scope } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import Droppable from "./drop-wrapper";
import CardList from "../card/card-list/card-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectGroup,
  SelectLabel,
} from "../ui/select";
import { useUserStore } from "@/stores/user-store";
import InlineEditText from "../ui/inline-edit-text";
import { MdOutlineSync } from "react-icons/md";
import { fetchUserListsFromSupabase } from "@/lib/lists/sync-lists";
import { FiTrash2 } from "react-icons/fi";
import { DEFAULT_LIST, SPECIAL_LIST_KEYS } from "@/lib/constants";
import { isSpecialListKey } from "@/lib/lists/special-list";
import { toast } from "sonner";
import { generateNewListNames } from "@/lib/lists/creat-new-list-names";
import { useScopedUIStore } from "@/stores/ui-store";

const NEW_ITEM_KEY = "__new__";
const NO_ACTION = "__dud__";

export default function ListPanel({
  draggedCon,
  scope,
}: {
  draggedCon: ConventionInfo | null;
  scope: Scope;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const profile = useUserStore((s) => s.profile);

  const lists = useListStore((s) => s.lists);
  const { showingNow, setShowingNow } = useScopedUIStore(scope);
  const createList = useListStore((s) => s.createList);
  const renameList = useListStore((s) => s.renameList);
  const deleteList = useListStore((s) => s.deleteList);

  const [isSyncing, setIsSyncing] = useState(false);

  // if current list was removed somehow, fall back to "planning"
  useEffect(() => {
    const currentList = lists[showingNow];
    if (!currentList) {
      setShowingNow(DEFAULT_LIST);
    }
  }, [lists, showingNow, setShowingNow]);

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
  function handleNewList() {
    if (!profile?.username) return;

    const { newListId, label } = generateNewListNames({
      lists,
      username: profile.username,
    });

    createList(newListId, label);
    setShowingNow(newListId);
  }

  return (
    <Droppable item={draggedCon ?? undefined}>
      <div className="flex flex-col mb-4">
        <div className="flex flex-row justify-between items-baseline">
          <h1 className="font-bold uppercase text-sm text-primary-muted">
            My lists
          </h1>
          <InlineEditText
            value={lists[showingNow].label}
            onChange={(newLabel) => renameList(showingNow, newLabel)}
          />
        </div>
        <p className="text-xs text-primary-muted mb-2">
          {profile ? `` : `Sign in to save and create new lists`}
        </p>
        <div className="flex gap-2 items-center justify-between">
          <Select
            onValueChange={(value) => {
              if (value === NEW_ITEM_KEY) {
                handleNewList();
              } else if (value === NO_ACTION) {
                return;
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
              <SelectGroup>
                <SelectLabel>Default Lists</SelectLabel>
                {SPECIAL_LIST_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {lists[key].label}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectSeparator />
                {profile ? (
                  <>
                    <SelectLabel>My Lists</SelectLabel>

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
                ) : (
                  <SelectItem value={NO_ACTION} className="text-primary-muted">
                    Sign in to make new lists
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {profile && (
            <div className="flex flex-row gap-4 items-center  text-primary-muted">
              <MdOutlineSync
                title="Sync Lists"
                onClick={async () => {
                  if (isSyncing) return;
                  setIsSyncing(true);
                  await fetchUserListsFromSupabase(profile.user_id);
                  const listCount = Object.keys(
                    useListStore.getState().lists
                  ).length;

                  // simulate spin duration even if fetch is fast
                  setTimeout(() => {
                    setIsSyncing(false);
                    toast.success(
                      `Synced ${listCount} ${
                        listCount === 1 ? "list" : "lists"
                      }!`
                    );
                  }, 1000); // 0.8s spin
                }}
                className={`cursor-pointer size-5 transition-transform hover:text-primary-darker ${
                  isSyncing ? "animate-spin-twice" : "hover:rotate-12"
                }`}
              />
              {!isSpecialListKey(showingNow) && (
                <FiTrash2
                  title="Delete Current List"
                  className="cursor-pointer size-4.5 hover:text-primary-darker"
                  onClick={() => {
                    const deletedLabel = lists[showingNow].label;
                    const confirmed = window.confirm(
                      `Are you sure you want to delete "${deletedLabel}"?`
                    );
                    if (!confirmed) return;

                    deleteList(showingNow);
                    toast.success(`"${deletedLabel}" was deleted.`);
                    setShowingNow(DEFAULT_LIST);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {lists[showingNow].items.length === 0 ? (
        <div className="text-sm text-center text-primary-muted px-2">
          No cons in this list. <br />
          Drag your favorite cons here!
        </div>
      ) : (
        <div
          ref={scrollRef}
          className={`overflow-y-auto flex-grow max-h-[calc(100vh-24rem)] 
            scrollbar-thin scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-thumb-secondary-lightest
            }`}
        >
          <CardList items={lists[showingNow].items} type="list" scope={scope} />
        </div>
      )}
    </Droppable>
  );
}
