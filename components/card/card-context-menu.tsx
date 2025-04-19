import { ConventionInfo } from "@/types/types";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "../ui/context-menu";
import { CardVariant } from "./card";
import { useListStore } from "@/stores/use-list-store";

export default function CardContextMenu({
  con,
  type,
}: {
  con: ConventionInfo;
  type: CardVariant;
}) {
  const removeFromList = useListStore((s) => s.removeFromList);
  const showingNow = useListStore((s) => s.showingNow);

  return (
    <ContextMenuContent>
      {type !== "list" ? (
        <>
          <ContextMenuItem>This Menu</ContextMenuItem>
          <ContextMenuItem>Doesn&apos;t do</ContextMenuItem>
          <ContextMenuItem>Anything yet</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add To List</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                Save Page As...
                <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>Create Shortcut...</ContextMenuItem>
              <ContextMenuItem>Name Window...</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Developer Tools</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>
            Search
            <ContextMenuShortcut>⌘L</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      ) : (
        <>
          <ContextMenuItem onClick={() => removeFromList(showingNow, con.id)}>
            Remove From List
          </ContextMenuItem>
        </>
      )}
    </ContextMenuContent>
  );
}
