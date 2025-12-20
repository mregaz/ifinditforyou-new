import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

const SUPPORTED = ["it", "en", "fr", "de", "es"] as const;
type Locale = (typeof SUPPORTED)[number];

function asLocale(v?: string | null): Locale | null {
  if (!v) return null;
  const two = v.slice(0, 2).toLowerCase();
  return (SUPPORTED as readonly string[]).includes(two) ? (two as Locale) : null;
}

async function detectLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const h = await headers();

  const fromCookie =
    asLocale(cookieStore.get("NEXT_LOCALE")?.value) ??
    asLocale(cookieStore.get("ifiy_lang")?.value);

  if (fromCookie) return fromCookie;

  const al = h.get("accept-language");
  const fromHeader = asLocale(al?.split(",")[0]?.trim() ?? null);
  return fromHeader ?? "it";
}

export default async function Page() {
  const locale = await detectLocale();
  redirect(`/${locale}/login`);
}
