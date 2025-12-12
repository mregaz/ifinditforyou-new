// app/[locale]/account/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

type LayoutProps = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export default async function AccountLayout({
  children,
  params,
}: LayoutProps) {
  // usiamo getCurrentUser che abbiamo definito in lib/auth
  const user = await getCurrentUser();

  // se non c'è utente → vai a /login
  if (!user) {
    redirect("/login");
  }

  // qui potresti usare params.locale per cose di lingua,
  // ma per adesso ci basta rendere i children
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { locale } = params;

  return <>{children}</>;
}
