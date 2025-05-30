// this is that little menu thing when you right click on the card
// or click on that little hamburger thing on the card.
// It's the menu thing with the extra options like "copy link" and "add to list"

import { ConventionInfo, Scope } from "@/types/con-types";

import { CardVariant } from "./card";
import { useListStore } from "@/stores/list-store";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";
import { DEFAULT_ZOOM, SPECIAL_LIST_KEYS } from "@/lib/constants";
import { generateNewListNames } from "@/lib/lists/create-new-list-names";
import {
  SharedMenuItem,
  SharedMenuSeparator,
  SharedMenuSub,
  SharedMenuSubContent,
  SharedMenuSubTrigger,
} from "../ui/shared-menu";
import { toastAddedToList, toastAlreadyInList } from "@/lib/default-toasts";
import {
  useExploreSelectedCardsStore,
  useScopedSelectedCardsStore,
} from "@/stores/page-store";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/stores/map-store";
import { log } from "@/lib/utils";
import { useScopedUIStore } from "@/stores/ui-store";

export default function CardContextMenu({
  con,
  cardType,
  menuType = "context",
  scope,
}: {
  con: ConventionInfo;
  cardType: CardVariant;
  menuType: "context" | "dropdown";
  scope: Scope;
}) {
  const profile = useUserStore((s) => s.profile);

  const addToList = useListStore((s) => s.addToList);
  const createList = useListStore((s) => s.createList);

  const removeFromList = useListStore((s) => s.removeFromList);
  const alreadyInList = useListStore((s) => s.alreadyInList);
  const lists = useListStore((s) => s.lists);

  const router = useRouter();

  const setShowingNow = useListStore((s) => s.setShowingNow);
  const showingNow = useListStore((s) => s.showingNow);
  const setSelectedCon = useScopedSelectedCardsStore(scope).setSelectedCon;
  const setSelectedExploreCon = useExploreSelectedCardsStore(
    (s) => s.setSelectedCon
  );

  const setShowListPanel = useScopedUIStore(scope).setShowListPanel;

  const flyTo = useMapStore((s) => s.flyTo);

  function handleAddToNewList() {
    if (!profile?.username) return;

    const { newListId, label } = generateNewListNames({
      lists,
      username: profile.username,
    });

    setShowListPanel(true);

    createList(newListId, label);
    addToList(newListId, con);
    setShowingNow(newListId);

    setSelectedCon(con);

    toastAddedToList(con.name, label);
  }

  function handleAddToList(listId: string) {
    const listLabel = lists[listId].label;

    // make sure not already in there
    if (alreadyInList(listId, con)) {
      toastAlreadyInList(con.name, listLabel);
      return;
    }

    setShowListPanel(true);

    setShowingNow(listId);
    addToList(listId, con);
    toastAddedToList(con.name, listLabel);
    setSelectedCon(con);
    log("Added", con.name, "to list", listLabel);
  }

  return (
    <>
      <>
        {cardType != "prediction" && (
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
              {false && profile && (
                <>
                  <SharedMenuSeparator type={menuType} />
                  {Object.entries(lists)
                    .filter(([key]) =>
                      key.startsWith(`${profile?.username}-list-`)
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
        )}
      </>
      {cardType === "list" && (
        <>
          <SharedMenuItem
            type={menuType}
            onClick={() => removeFromList(showingNow, con)}
          >
            Remove From List
          </SharedMenuItem>
        </>
      )}
      {cardType != "prediction" && <SharedMenuSeparator type={menuType} />}
      <SharedMenuItem
        type={menuType}
        onClick={() => {
          const url = `${window.location.origin}/explore?con=${con.slug}`;
          navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard");
        }}
      >
        Copy Link
      </SharedMenuItem>
      {scope === "plan" ? (
        <SharedMenuItem
          type={menuType}
          onClick={() => {
            setSelectedExploreCon(con); // this is Explore page's setSelected
            router.push(`/explore`);
            flyTo?.(
              { latitude: con.location_lat, longitude: con.location_long },
              DEFAULT_ZOOM
            );
          }}
        >
          View on Map
        </SharedMenuItem>
      ) : (
        ""
      )}
    </>
  );
}
