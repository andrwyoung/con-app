"use server";

import { Persona } from "@/types/enums";
import { createClient } from "../supabase/server";

export async function signupUser({
    email,
    password,
    username,
    persona,
  }: {
    email: string;
    password: string;
    username: string;
    persona: Persona;
  }) { 
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data?.user) {
    return { error: error?.message || "Signup failed." };
  }

    const { error: profileError } = await supabase
    .from("user_profiles")
    .insert({
      user_id: data.user.id,
      username,
      persona,
      role: "FREE",
    });

  if (profileError) {
    console.log(profileError);
    return { error: "Failed to save user profile." };
  }

  return { success: true };
  }