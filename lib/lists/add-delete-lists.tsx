import { supabaseAnon } from "../supabase/client";
import { useUserStore } from "@/stores/user-store";

export async function createListInSupabase({
  listId,
  label,
}: {
  listId: string;
  label: string;
}) {
  const userId = useUserStore.getState().user?.id;
  if (!userId) return;

  // Infer special_type automatically based on known list IDs
  const specialType =
    listId === "planning"
      ? "planning"
      : listId === "interested"
      ? "interested"
      : null;

  const { error } = await supabaseAnon.from("user_convention_lists").upsert(
    {
      list_id: listId,
      label,
      user_id: userId,
      special_type: specialType,
    },
    { onConflict: "list_id, user_id" }
  );

  if (error) {
    console.error("Failed to create list in Supabase:", error);
    throw error;
  }

  console.log("Created list:", listId, "with special_type:", specialType);
}

export async function renameListInSupabase({
  listId,
  newLabel,
}: {
  listId: string;
  newLabel: string;
}) {
  const userId = useUserStore.getState().user?.id;
  if (!userId) return;

  const { data, error } = await supabaseAnon
    .from("user_convention_lists")
    .update({ label: newLabel })
    .match({ list_id: listId, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error("Failed to rename list in Supabase:", error);
    throw error;
  }

  console.log("Renamed list:", listId, "to", newLabel);
}

export async function deleteListFromSupabase({ listId }: { listId: string }) {
  const userId = useUserStore.getState().user?.id;
  if (!userId) return;

  const { error } = await supabaseAnon
    .from("user_convention_lists")
    .delete()
    .match({
      list_id: listId,
      user_id: userId,
    });

  if (error) {
    console.error("Failed to delete list in Supabase:", error);
    throw error;
  }

  console.log("Deleted list and its related items:", listId);
}
