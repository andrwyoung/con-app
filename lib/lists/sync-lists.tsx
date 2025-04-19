import { ListStore, useListStore } from "@/stores/use-list-store";
import { useUserStore } from "@/stores/user-store";
import { supabaseAnon } from "../supabase/client";
import { useEventStore } from "@/stores/all-events-store";
import { UNKNOWN_CONVENTION } from "../constants";

export async function syncAllListsToSupabase() {
  const userId = useUserStore.getState().user?.id;
  if (!userId) return;

  const lists = useListStore.getState().lists;

  for (const [listId, { label, items }] of Object.entries(lists)) {
    console.log(
      "looping through uploading",
      listId,
      " for ",
      label,
      " and items:",
      items
    );
    // 1. uploading the list itself
    const { error: listError } = await supabaseAnon
      .from("user_convention_lists")
      .upsert(
        {
          user_id: userId,
          list_id: listId,
          label,
        },
        {
          onConflict: "user_id, list_id",
        }
      );

    if (listError) {
      console.error(`Failed to upsert list "${listId}":`, listError);
      continue;
    }

    // 2. uploading each item in the list
    const itemInserts = items.map((item) => ({
      user_id: userId,
      list_id: listId,
      convention_id: item.id,
    }));

    if (itemInserts.length > 0) {
      const { error: itemError } = await supabaseAnon
        .from("user_convention_list_items")
        .upsert(itemInserts, { onConflict: "user_id, list_id, convention_id" });

      if (itemError) {
        console.error(
          `Failed to upsert items for list "${listId}":`,
          itemError
        );
      }
    }
  }
}

export async function fetchUserListsFromSupabase(userId: string) {
  const { data: listMeta, error: listError } = await supabaseAnon
    .from("user_convention_lists")
    .select("*")
    .eq("user_id", userId);

  if (listError) {
    console.error("Error fetching lists:", listError);
    return;
  }

  console.log("fetched lists from supabase: ", listMeta);

  const { data: listItems, error: itemError } = await supabaseAnon
    .from("user_convention_list_items")
    .select("*")
    .eq("user_id", userId);

  if (itemError) {
    console.error("Error fetching list items:", itemError);
    return;
  }

  console.log("fetched items from supabase: ", listItems);

  const parsedLists: ListStore["lists"] = {};

  for (const list of listMeta) {
    parsedLists[list.list_id] = {
      label: list.label,
      items: [],
    };
  }

  await useEventStore.getState().ensureInitialized();
  const eventsDict = useEventStore.getState().allEvents;

  for (const item of listItems) {
    const list = parsedLists[item.list_id];
    if (!list) continue;

    list.items.push(eventsDict[item.convention_id] ?? UNKNOWN_CONVENTION);
  }

  console.log("setting lists: ", parsedLists);

  useListStore.getState().setLists(parsedLists);
}
