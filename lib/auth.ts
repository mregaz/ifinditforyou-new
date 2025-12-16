import { createClient } from "@/lib/supabase/server";

/**
 * Ritorna l'utente Supabase corrente (oppure null).
 * Server-side only.
 */
export async function getCurrentUser() {
  const supabase = await createClient(); // FIX: await

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user;
}

/**
 * Helper: user id (oppure null).
 */
export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id ?? null;
}
