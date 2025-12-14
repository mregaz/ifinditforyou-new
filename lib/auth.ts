import { prisma } from "@/lib/prisma";

// Qui devi usare il meccanismo di auth che hai già.
// Se usi Supabase auth, me lo dici e te lo adatto.
// Per ora versione minimale basata su cookie "userId"

export async function getUserFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/userId=([^;]+)/);

  if (!match) return null;

  const userId = match[1];

  return prisma.user.findUnique({
    where: { id: userId },
  });
}
import { createClient } from "./supabaseServer";

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  return data.user;
}
