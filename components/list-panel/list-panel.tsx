// this all the code that displays that list panel next to the sidebar

import { useListStore } from "@/stores/list-store";
import { Scope } from "@/types/con-types";
import { useEffect, useState } from "react";
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
import {
  DEFAULT_LIST,
  LIST_SORT_OPTIONS,
  SPECIAL_LIST_KEYS,
} from "@/lib/constants";
import { isSpecialListKey } from "@/lib/lists/special-list";
import { toast } from "sonner";
import { generateNewListNames } from "@/lib/lists/create-new-list-names";
import { useModalUIStore, useScopedUIStore } from "@/stores/ui-store";
import { getSortLabel, SortType } from "@/types/sort-types";

const NEW_ITEM_KEY = "__new__";
const LOGIN_KEY = "__login__";

export default function ListPanel({ scope }: { scope: Scope }) {
  const profile = useUserStore((s) => s.profile);

  const lists = useListStore((s) => s.lists);
  const showingNow = useListStore((s) => s.showingNow);
  const setShowingNow = useListStore((s) => s.setShowingNow);
  const createList = useListStore((s) => s.createList);
  const renameList = useListStore((s) => s.renameList);
  const deleteList = useListStore((s) => s.deleteList);

  const setLoginModalStep = useModalUIStore((s) => s.setLoginModalStep);

  const [isSyncing, setIsSyncing] = useState(false);
  const { listSortType: sortMode, setListSortType: setSortMode } =
    useScopedUIStore(scope);

  // if current list was removed somehow, fall back to "planning"
  useEffect(() => {
    const currentList = lists[showingNow];
    if (!currentList) {
      setShowingNow(DEFAULT_LIST);
    }
  }, [lists, showingNow, setShowingNow]);

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
    <Droppable>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          {/* <h1 className="font-bold uppercase text-sm text-primary-muted">
            Your lists
          </h1> */}
          <InlineEditText
            value={lists[showingNow].label}
            onChange={(newLabel) => renameList(showingNow, newLabel)}
          />
          {/* {!profile && (
            <p className="px-1 text-xs text-primary-muted text-right">
              Sign in to save
              <br />
              your lists
            </p>
          )} */}
        </div>

        <div className="px-1 flex gap-2 items-center justify-between">
          <Select
            onValueChange={(value) => {
              if (value === NEW_ITEM_KEY) {
                // NEW_ITEM_KEY will never conflict with value because value is
                // always "${username}-list-5" or "planning" or "interested"
                handleNewList();
              } else if (value === LOGIN_KEY) {
                setLoginModalStep("email");
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
                {/* <SelectLabel>Default Lists</SelectLabel> */}
                {/* always show default lists first */}
                {SPECIAL_LIST_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {lists[key].label}
                  </SelectItem>
                ))}
              </SelectGroup>
              {false && (
                <SelectGroup>
                  <SelectSeparator />
                  {/* then if they're logged in then show their personal lists */}
                  {profile ? (
                    <>
                      <SelectLabel>My Lists</SelectLabel>

                      {Object.entries(lists)
                        .filter(([key]) =>
                          key.startsWith(`${profile?.username}-list-`)
                        )
                        .map(([key, list]) => (
                          <SelectItem key={key} value={key}>
                            {list.label}
                          </SelectItem>
                        ))}

                      {/* we do NEW_ITEM_KEY because we can't do an onClick in SelectItem */}
                      <SelectItem
                        value={NEW_ITEM_KEY}
                        className="text-primary-muted"
                      >
                        + New List
                      </SelectItem>
                    </>
                  ) : (
                    // might remove this. kind of redundant, but it's like a CTA
                    <SelectItem
                      value={LOGIN_KEY}
                      className="text-primary-muted"
                    >
                      Sign in to make <br />
                      custom lists
                    </SelectItem>
                  )}
                </SelectGroup>
              )}
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

                  // syncing itself is like instant. but fake loading for UX
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

        <hr className="border-t border-primary-muted w-full mt-3 mb-3" />
      </div>

      {lists[showingNow].items.length === 0 ? (
        <div className="text-sm text-center text-primary-muted px-2">
          No cons in this list. <br />
          Star some cons!
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <p className="text-xs text-primary-text">Sorting by:</p>
            <Select
              onValueChange={(value) => setSortMode(value as SortType)}
              value={sortMode}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>{getSortLabel(sortMode)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {LIST_SORT_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div
            className={`overflow-y-auto flex-grow max-h-[calc(100dvh-25rem)] 
            scrollbar-thin scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-thumb-secondary-lightest
            }`}
          >
            <CardList
              items={lists[showingNow].items}
              type="list"
              scope={scope}
              sortOption={sortMode}
            />
          </div>{" "}
        </div>
      )}
    </Droppable>
  );
}
