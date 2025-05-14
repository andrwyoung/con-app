// this file checks the database itself to see if a user is an admin
// honestly....we don't reallyyyy need it because the database doesn't even allow
// certain actions if you aren't an admin automatically

import { supabaseAnon } from "../supabase/client";

export async function checkIsAdmin(): Promise<boolean> {
  const { data: user, error } = await supabaseAnon.auth.getUser();
  if (error || !user) return false;

  const { data: profile } = await supabaseAnon
    .from("user_profiles")
    .select("role")
    .eq("user_id", user.user?.id)
    .single();

  return profile?.role === "ADMIN" || profile?.role === "SUDO";
}
