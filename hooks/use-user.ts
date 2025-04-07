import { supabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useUser() {
    const [user, setUser] = useState<User | null | undefined>(undefined);
  
    useEffect(() => {
      const { data: listener } = supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log(event, session)
        setUser(session?.user ?? null);
      });
  
      supabaseClient.auth.getUser().then(({ data }) => setUser(data.user));
  
      return () => {
        listener.subscription.unsubscribe();
      };
    }, []);
  
    return user;
  }