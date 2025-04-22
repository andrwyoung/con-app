import { ListStore, useListStore } from "@/stores/list-store";
import { useUserStore } from "@/stores/user-store";
import { supabaseAnon } from "../supabase/client";
import { useEventStore } from "@/stores/all-events-store";
import {
  DEFAULT_LISTS,
  SPECIAL_LIST_KEYS,
  UNKNOWN_CONVENTION,
} from "../constants";

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
    const itemInserts = items
      .filter((item) => typeof item.id === "number")
      .map((item) => ({
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

export function ensureAllDefaultsExist(
  input: Record<string, ListStore["lists"][string]>
): Record<string, ListStore["lists"][string]> {
  const filled = { ...input };

  for (const key of SPECIAL_LIST_KEYS) {
    if (!filled[key]) {
      filled[key] = DEFAULT_LISTS[key];
    }
  }

  return filled;
}

export async function ensureDefaultListsExist(userId: string) {
  const { data: existingLists, error } = await supabaseAnon
    .from("user_convention_lists")
    .select("list_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch existing user lists:", error);
    return;
  }

  // check if supabase matches our local lists
  const existingIds = new Set(existingLists?.map((list) => list.list_id));
  const missingDefaults = SPECIAL_LIST_KEYS.filter(
    (key) => !existingIds.has(key)
  );

  if (missingDefaults.length === 0) {
    console.log("All default lists already exist.");
    return;
  }

  const inserts = missingDefaults.map((key) => ({
    user_id: userId,
    list_id: key,
    label: DEFAULT_LISTS[key].label,
  }));

  const { error: insertError } = await supabaseAnon
    .from("user_convention_lists")
    .insert(inserts);

  if (insertError) {
    console.error("Failed to insert default lists:", insertError);
  } else {
    console.log(
      "Inserted default lists:",
      inserts.map((i) => i.list_id)
    );
  }
}

export async function fetchUserListsFromSupabase(userId: string) {
  // Always make sure default list shells exist
  await ensureDefaultListsExist(userId);

  const { data: listMeta, error: listError } = await supabaseAnon
    .from("user_convention_lists")
    .select("*")
    .eq("user_id", userId);

  if (listError) {
    console.error("Error fetching lists:", listError);
    return;
  }

  console.log("fetched lists from supabase: ", listMeta);
  // guard if they default lists don't exist
  if (!listMeta?.length) {
    console.warn("No user lists found. Using default.");
    useListStore.getState().setLists(DEFAULT_LISTS);
    return;
  }

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
