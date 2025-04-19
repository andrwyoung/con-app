// the purpose of this file is to grab all the user profile info from Supabase
// and then store it locally

"use client";
import { fetchUserListsFromSupabase, syncAllListsToSupabase } from "@/lib/lists/sync-lists";
import { supabaseAnon } from "@/lib/supabase/client";
import { useListStore } from "@/stores/use-list-store";
import { useUserStore } from "@/stores/user-store";
import { useEffect } from "react";

export function useUser() {
  const { user, setUser, setProfile } = useUserStore();
  const resetLists = useListStore.getState().resetLists;

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabaseAnon
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Failed to fetch user profile:", error);
        setProfile(null);
        return;
      }

      setProfile(data);

      if (data.has_never_logged_in) {
        await syncAllListsToSupabase();
      } else {
        resetLists();
      }
        
      await fetchUserListsFromSupabase(userId);
    };

    const { data: listener } = supabaseAnon.auth.onAuthStateChange(
      (_, session) => {
        const user = session?.user ?? null;
        setUser(user);

        if (user) {
          void fetchProfile(user.id);
        } else {
          setProfile(null);
        }
      }
    );

    supabaseAnon.auth.getUser().then(({ data }) => {
      const user = data.user;
      setUser(user);

      if (user) {
        supabaseAnon.auth.getSession().then(({ data: session }) => {
          console.log("Current Supabase session:", session);
      });

      void fetchProfile(user.id);
    }
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, [setUser, setProfile]);

  return user;
}