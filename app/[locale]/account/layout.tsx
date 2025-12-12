// app/[locale]/account/layout.tsx
import type { LayoutProps } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

type Props = LayoutProps<{ locale: string }>;

export default async function AccountLayout({ children, params }: Props) {
  const user = await getCurrentUser();

  // se non sei loggato → vai a /login
  if (!user) {
    redirect("/login");
  }

  // usiamo params.locale solo per evitare warning TS/ESLint
  void params.locale;

  return <>{children}</>;
}
