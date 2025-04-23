import { ConventionInfo } from "@/types/types";

import { CardVariant } from "./card";
import { useListStore } from "@/stores/list-store";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";
import { DEFAULT_ZOOM, SPECIAL_LIST_KEYS } from "@/lib/constants";
import { generateNewListNames } from "@/lib/lists/creat-new-list-names";
import {
  SharedMenuItem,
  SharedMenuSeparator,
  SharedMenuSub,
  SharedMenuSubContent,
  SharedMenuSubTrigger,
} from "../ui/shared-menu";
import { toastAddedToList, toastAlreadyInList } from "@/lib/default-toasts";
import { useScopedUIStore } from "@/stores/ui-store";
import { useExploreSelectedCardsStore } from "@/stores/sidebar-store";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/stores/map-store";
import { useCurrentScope } from "@/hooks/use-current-scope";

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
  const alreadyInList = useListStore((s) => s.alreadyInList);
  const lists = useListStore((s) => s.lists);

  const router = useRouter();
  const scope = useCurrentScope();

  const setShowingNow = useScopedUIStore(scope).setShowingNow;
  const showingNow = useScopedUIStore(scope).showingNow;
  const setSelectedExploreCon = useExploreSelectedCardsStore(
    (s) => s.setSelectedCon
  );
  const flyTo = useMapStore((s) => s.flyTo);

  function handleAddToNewList() {
    if (!profile?.username) return;

    const { newListId, label } = generateNewListNames({
      lists,
      username: profile.username,
    });

    createList(newListId, label);
    addToList(newListId, con);
    setShowingNow(newListId);

    toastAddedToList(con.name, label);
  }

  function handleAddToList(listId: string) {
    const listLabel = lists[listId].label;

    // make sure not already in there
    if (alreadyInList(listId, con)) {
      toastAlreadyInList(con.name, listLabel);
      return;
    }

    addToList(listId, con);
    toastAddedToList(con.name, listLabel);
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
