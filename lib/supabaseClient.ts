import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Factory: ogni volta che la chiami ottieni un client Supabase
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

