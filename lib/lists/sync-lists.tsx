// KEY SECTION: especially fetchUserListsFromSupabase
// this file is the one responsible for grabbing the latest data from Supabase
// as well as initializing the default lists for users if they don't exist

import { ListStore, useListStore } from "@/stores/list-store";
import { useUserStore } from "@/stores/user-store";
import { supabaseAnon } from "../supabase/client";
import { useEventStore } from "@/stores/all-events-store";
import {
  DEFAULT_LISTS,
  SPECIAL_LIST_KEYS,
  UNKNOWN_CONVENTION,
} from "../constants";
import { log } from "../utils";
import {
  ConventionInfo,
  ConventionYear,
  UserListItem,
} from "@/types/con-types";
import { addListItemToSupabase } from "./add-delete-items";
import { getConventionYearId } from "./helper-functions";

// really only used once on first login just so they don't have to recompile their lists on first signup?
// idk if anyone will even use this lol
// if there are issues with this function we should scrap immediately
export async function syncAllListsToSupabase() {
  const userId = useUserStore.getState().user?.id;
  if (!userId) return;

  const lists = useListStore.getState().lists;

  for (const [listId, { label, items }] of Object.entries(lists)) {
    log(
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

    for (const item of items) {
      const itemYearId = getConventionYearId(item);
      await addListItemToSupabase({
        listId,
        conventionId: item.id,
        conventionYearId: itemYearId,
      });
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
    log("All default lists already exist.");
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
    log(
      "Inserted default lists:",
      inserts.map((i) => i.list_id)
    );
  }
}

export async function fetchUserListsFromSupabase(userId: string) {
  // Always make sure default list shells exist
  await ensureDefaultListsExist(userId);

  // 1: grab all the lists
  const { data: listMeta, error: listError } = await supabaseAnon
    .from("user_convention_lists")
    .select("*")
    .eq("user_id", userId);

  if (listError) {
    console.error("Error fetching lists:", listError);
    return;
  }

  log("fetched lists from supabase: ", listMeta);
  // guard if they default lists don't exist
  if (!listMeta?.length) {
    console.warn("No user lists found. Using default.");
    useListStore.getState().setLists(DEFAULT_LISTS);
    return;
  }

  // 2: grab all items in the list. including the convention_year if it has it
  const { data, error: itemError } = await supabaseAnon
    .from("user_convention_list_items")
    .select("*, convention_year:convention_year_id(*)")
    .eq("user_id", userId);

  if (itemError) {
    console.error("Error fetching list items:", itemError);
    return;
  }

  // cast for safety and readability
  type SupabaseListItemWithYear = UserListItem & {
    convention_year: ConventionYear | null;
  };
  const listItems = data as SupabaseListItemWithYear[];

  log("fetched items from supabase: ", listItems);

  const parsedLists: ListStore["lists"] = {};

  for (const list of listMeta) {
    parsedLists[list.list_id] = {
      label: list.label,
      items: [],
    };
  }

  await useEventStore.getState().ensureInitialized();
  const eventsDict = useEventStore.getState().allEvents;

  // 3: since we only have convention ids (+ ConventionYear), grab the ConventionInfo too
  for (const item of listItems) {
    const list = parsedLists[item.list_id];
    if (!list) continue;

    const con = eventsDict[item.convention_id] ?? UNKNOWN_CONVENTION;

    let enrichedCon: ConventionInfo;

    // KEY SECTION (also kind of fragile lol): we keep track of if it's
    // historical or predictive based off of the convention_year_id
    //
    // if convention_year exists, then make sure ConventionInfo has that ID as truth
    if (item.convention_year) {
      enrichedCon = {
        ...con,
        specificYear: item.convention_year,
        convention_year_id: item.convention_year?.id,
      };
    } else {
      // if convention_year wasn't specified, then it must be a prediction
      enrichedCon = { ...con };
      delete (enrichedCon as ConventionInfo).specificYear;
      delete (enrichedCon as ConventionInfo).convention_year_id;
    }

    list.items.push(enrichedCon as ConventionInfo);
  }

  log("setting lists: ", parsedLists);

  useListStore.getState().setLists(parsedLists);
}
