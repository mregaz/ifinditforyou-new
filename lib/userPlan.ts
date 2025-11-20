import { prisma } from "./prisma";

export type PlanId = "free" | "pro";

export async function getUserPlan(userId: string | null): Promise<PlanId> {
  if (!userId) return "free";

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  return user?.plan === "pro" ? "pro" : "free";
}

export async function setUserPlanPro(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { plan: "pro" },
  });
}
