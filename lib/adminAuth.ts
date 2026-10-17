
import "server-only";

import { getCurrentUser } from "@/lib/auth";

export async function requireAdmin(): Promise<void> {
  const adminUserId = process.env.PHOENIX_ADMIN_USER_ID?.trim();

  // Accesso negato se l'amministratore non è configurato.
  if (!adminUserId) {
    throw new Error("ADMIN_ACCESS_DENIED");
  }

  const user = await getCurrentUser();

  // L'identità deve essere verificata da Supabase Auth.
  if (!user || user.id !== adminUserId) {
    throw new Error("ADMIN_ACCESS_DENIED");
  }
}
