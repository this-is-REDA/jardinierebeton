import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Variables Supabase manquantes.");
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Alias pour compatibilité avec ContactSection
export const createSupabaseClient = createSupabaseBrowserClient;
