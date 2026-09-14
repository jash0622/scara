import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// Service role client — full DB access, bypasses RLS.
// NEVER expose this client or the service role key to the browser.
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      // Disable auto-refresh and session persistence — this is a server-side client
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);
