import { createClient } from "@/lib/supabase/server";

export type PlanId = "free" | "pro";

export async function getUserPlan(userId: string | null): Promise<PlanId> {
  if (!userId) return "free";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("User")
    .select("is_pro")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("getUserPlan error:", error);
    return "free";
  }

  return data?.is_pro ? "pro" : "free";
}

// utile se vuoi forzare PRO manualmente (admin/debug)
export async function setUserPlanPro(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("User").update({ is_pro: true }).eq("id", userId);

  if (error) {
    console.error("setUserPlanPro error:", error);
    throw error;
  }
}

