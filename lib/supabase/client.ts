import { createBrowserClient } from '@supabase/ssr'

// TODO: rename to supabase once you get rid of the other one
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)