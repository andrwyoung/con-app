"use server"

import { createClient } from "@/lib/supabase/server"

export async function signup({email, password}: {
    email: string; password: string
}) {
    console.log("submitting");

    const supabase = await createClient()

    console.log("submitting");
    const { error } = await supabase.auth.signUp({email, password})
    console.log({error});
}