import { createClient } from "@supabase/supabase-js";

const supabaseUrl = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_SUPABASE_URL || "") : "";
const supabaseKey = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "") : "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: any = null;

export function getSupabase() {
  if (_client) return _client;
  if (!supabaseUrl || !supabaseKey) return null;
  _client = createClient(supabaseUrl, supabaseKey);
  return _client;
}
