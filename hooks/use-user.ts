// the purpose of this file is to grab all the user profile info from Supabase
// and then store it locally

"use client";
import { supabaseAnon } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { useEffect } from "react";

export function useUser() {
  const { user, setUser, setProfile } = useUserStore();

  useEffect(() => {
    // helper function: fetch data from user_profiles given auth.user.id
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
    };

    // if authentication changes, then reflect that on the store
    const { data: listener } = supabaseAnon.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user ?? null;
        setUser(user);

        if (user) {
          fetchProfile(user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // on init, set the user
    supabaseAnon.auth.getUser().then(({ data }) => {
      const user = data.user;
      setUser(user);
      if (user) {
        fetchProfile(user.id);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser, setProfile]);

  return user;
}
