import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("supabase env variables are missing!");
}

// TODO: rename to supabase once you get rid of the other one
export const supabaseAnon = createBrowserClient(
  supabaseUrl, supabaseKey
)