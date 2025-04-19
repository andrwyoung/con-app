import { supabaseAnon } from "../supabase/client";
import { useUserStore } from "@/stores/user-store";

export async function addListItemToSupabase({
  listId,
  conventionId,
  status,
  notes,
}: {
  listId: string;
  conventionId: number;
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
      status: status ?? null,
      notes: notes ?? null,
    });

  if (error) {
    console.error("Failed to add item to Supabase:", error);
    throw error;
  }

  console.log("added: ", conventionId);
}

export async function updateListItemInSupabase({
  listId,
  conventionId,
  status,
  notes,
}: {
  listId: string;
  conventionId: number;
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
    })
    .match({
      user_id: userId,
      list_id: listId,
      convention_id: conventionId,
    });

  if (error) {
    console.error("Failed to update item in Supabase:", error);
    throw error;
  }

  console.log("Updated item:", conventionId, "with", { status, notes });
}

export async function removeListItemFromSupabase({
  listId,
  conventionId,
}: {
  listId: string;
  conventionId: number;
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
    });

  if (error) {
    console.error("Failed to remove item from Supabase:", error);
    throw error;
  }

  console.log("deleted: ", conventionId);
}
