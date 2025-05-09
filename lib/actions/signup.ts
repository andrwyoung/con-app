// create user profile for user
// we need the sudo key because we want to write user profile data without them being logged in
"use server";

import { Persona } from "@/components/auth/steps/signup-step";
import { createClientSudo } from "../supabase/server";
import { log } from "../utils";

export async function signupUser({
  finalEmail: email,
  password,
  username,
  persona,
}: {
  finalEmail: string;
  password: string;
  username: string;
  persona: Persona;
}) {
  const supabase = await createClientSudo();
  email = email.toLowerCase().trim();

  // check if email already exists in user_profile. this is our own manual check
  const { data: existingUsers, error: userCheckError } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("email", email);

  // if couldn't access the table
  if (userCheckError) {
    console.error(userCheckError);
    return { error: "Internal Error. Please try again." };
  }
  if (existingUsers && existingUsers.length > 0) {
    return { error: "This email is already in use." };
  }

  // if email is not in use, then signup through supabase's auth table
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  // supabase give some dummy data that we can handle
    if(!signUpData?.user) {
      return { error: "Signup failed. Please try again."}
  }
  // they also have more in depth email checks
  if (signUpError) {
    if (/Email address\s+"[^"]+"\s+is invalid/i.test(signUpError.message)) {
          return { error: "Please enter a valid email address."};
    }
    return { error: signUpError };
  }

  // inserting into our personal user_profile table
  const { error: profileError } = await supabase.from("user_profiles").insert({
    user_id: signUpData.user.id,
    username,
    persona,
    role: "FREE",
    email: email,
  });

  if (profileError) {
    log(profileError);
    return { error: "Failed to save user profile." };
  }

  return { success: true };
}
