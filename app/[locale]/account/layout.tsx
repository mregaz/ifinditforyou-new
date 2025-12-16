// app/[locale]/account/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function AccountLayout({ children, params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${params.locale}/login`);
  }

  return <div className="min-h-screen bg-slate-950 text-slate-50">{children}</div>;
}


