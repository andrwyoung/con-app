import { ConventionInfo } from "@/types/types";

import { CardVariant } from "./card";
import { useListStore } from "@/stores/use-list-store";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";
import { SPECIAL_LIST_KEYS } from "@/lib/constants";
import { generateNewListNames } from "@/lib/lists/creat-new-list-names";
import {
  SharedMenuItem,
  SharedMenuSeparator,
  SharedMenuShortcut,
  SharedMenuSub,
  SharedMenuSubContent,
  SharedMenuSubTrigger,
} from "../ui/shared-menu";

export default function CardContextMenu({
  con,
  cardType,
  menuType = "context",
}: {
  con: ConventionInfo;
  cardType: CardVariant;
  menuType: "context" | "dropdown";
}) {
  const profile = useUserStore((s) => s.profile);

  const addToList = useListStore((s) => s.addToList);
  const createList = useListStore((s) => s.createList);

  const removeFromList = useListStore((s) => s.removeFromList);
  const setShowingNow = useListStore((s) => s.setShowingNow);
  const showingNow = useListStore((s) => s.showingNow);
  const alreadyInList = useListStore((s) => s.alreadyInList);
  const lists = useListStore((s) => s.lists);

  function handleAddToNewList() {
    if (!profile?.username) return;

    const { newListId, label } = generateNewListNames({
      lists,
      username: profile.username,
    });

    createList(newListId, label);
    addToList(newListId, con);
    setShowingNow(newListId);

    toast(`Added ${con.name} to new List: ${newListId}`);
  }

  function handleAddToList(listId: string) {
    const listLabel = lists[listId].label;

    // make sure not already in there
    if (alreadyInList(listId, con)) {
      toast(`Already in list ${listLabel}`);
      return;
    }

    addToList(listId, con);
    toast(`Added ${con.name} to ${listLabel}`);
    console.log("Added", con.name, "to list", listLabel);
  }

  return (
    <>
      {cardType !== "list" ? (
        <>
          <SharedMenuSub type={menuType}>
            <SharedMenuSubTrigger type={menuType}>
              Add To List
            </SharedMenuSubTrigger>
            <SharedMenuSubContent
              type={menuType}
              className="w-44 max-h-64  overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent"
            >
              {SPECIAL_LIST_KEYS.map((listId) => (
                <SharedMenuItem
                  type={menuType}
                  key={listId}
                  onClick={() => handleAddToList(listId)}
                >
                  {lists[listId].label}
                </SharedMenuItem>
              ))}
              {profile && (
                <>
                  <SharedMenuSeparator type={menuType} />
                  {Object.entries(lists)
                    .filter(([key]) =>
                      key.startsWith(`${profile.username}-list-`)
                    )
                    .map(([listId, list]) => (
                      <SharedMenuItem
                        type={menuType}
                        key={listId}
                        onClick={() => handleAddToList(listId)}
                        className="truncate line-clamp-1"
                      >
                        {list.label}
                      </SharedMenuItem>
                    ))}
                  <SharedMenuItem
                    type={menuType}
                    className="text-primary-muted"
                    onClick={handleAddToNewList}
                  >
                    + Add to New List
                  </SharedMenuItem>
                </>
              )}
            </SharedMenuSubContent>
          </SharedMenuSub>
        </>
      ) : (
        <>
          <SharedMenuItem
            type={menuType}
            onClick={() => removeFromList(showingNow, con.id)}
          >
            Remove From List
          </SharedMenuItem>
        </>
      )}
      <SharedMenuSeparator type={menuType} />
      <SharedMenuItem
        type={menuType}
        aria-title="Copy Con Link"
        onClick={() => {
          const url = `${window.location.origin}/explore?con=${con.slug}`;
          navigator.clipboard.writeText(url);
          toast("Link copied to clipboard");
        }}
      >
        Copy Link
      </SharedMenuItem>
      <SharedMenuItem
        type={menuType}
        aria-title="Search All Cons"
        onClick={() => {
          setTimeout(() => {
            const input = document.getElementById("explore-searchbar");
            if (input instanceof HTMLInputElement) {
              input.focus();
            }
          }, 10);
        }}
      >
        Search
        <SharedMenuShortcut type={menuType}>⌘L</SharedMenuShortcut>
      </SharedMenuItem>
    </>
  );
}
