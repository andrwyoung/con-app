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