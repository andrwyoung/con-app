import { supabaseAnon } from "../supabase/client";
import { useUserStore } from "@/stores/user-store";
import { log } from "../utils";

export async function addListItemToSupabase({
  listId,
  conventionId,
  conventionYearId,
  status,
  notes,
}: {
  listId: string;
  conventionId: number;
  conventionYearId: string | null;
  status?: string;
  notes?: string;
}) {
  const userId = useUserStore.getState().user?.id;
  // skip if user isn't logged in
  if (!userId) return;

  const { error } = await supabaseAnon
    .from("user_convention_list_items")
    .insert({
      user_id: userId,
      list_id: listId,
      convention_id: conventionId,
      convention_year_id: conventionYearId,
      status: status ?? null,
      notes: notes ?? null,
    });

  if (error) {
    console.error("Failed to add item to Supabase:", error);
    throw error;
  }

  log("added: ", conventionId, "with id: ", conventionYearId);
}

export async function updateListItemInSupabase({
  listId,
  conventionId,
  conventionYearId,
  status,
  notes,
}: {
  listId: string;
  conventionId: number;
  conventionYearId: string | null;
  status?: string;
  notes?: string;
}) {
  const userId = useUserStore.getState().user?.id;
  if (!userId) return;

  const { error } = await supabaseAnon
    .from("user_convention_list_items")
    .update({
      status: status ?? null,
      notes: notes ?? null,
      convention_year_id: conventionYearId,
    })
    .match({
      user_id: userId,
      list_id: listId,
      convention_id: conventionId,
      convention_year_id: conventionYearId,
    });

  if (error) {
    console.error("Failed to update item in Supabase:", error);
    throw error;
  }

  log("Updated item:", conventionId, "with", {
    status,
    notes,
    conventionYearId,
  });
}

export async function removeListItemFromSupabase({
  listId,
  conventionId,
  conventionYearId,
}: {
  listId: string;
  conventionId: number;
  conventionYearId: string | null;
}) {
  const userId = useUserStore.getState().user?.id;
  // skip if user isn't logged in
  if (!userId) return;

  const { error } = await supabaseAnon
    .from("user_convention_list_items")
    .delete()
    .match({
      user_id: userId,
      list_id: listId,
      convention_id: conventionId,
      convention_year_id: conventionYearId,
    });

  if (error) {
    console.error("Failed to remove item from Supabase:", error);
    throw error;
  }

  log("deleted: ", conventionId, " with year id: ", conventionYearId);
}
