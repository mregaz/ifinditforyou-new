import { createClient } from "@/lib/supabase/server";

/**
 * Funzione canonica: utente corrente Supabase (server-side).
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

/**
 * Alias di compatibilità: alcuni file importano getCurrentUser.
 * (manteniamo lo stesso nome e la stessa firma)
 */
// export { getCurrentUser }; // già esportata sopra

/**
 * Alias di compatibilità: alcuni file potrebbero usare getUserFromRequest.
 * In App Router + Supabase, usiamo comunque auth cookies gestiti da Supabase.
 */
export async function getUserFromRequest(_req: Request) {
  return getCurrentUser();
}

/**
 * Helper: user id (oppure null).
 */
export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id ?? null;
}
