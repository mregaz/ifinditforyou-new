// app/pay/success/page.tsx
import Link from "next/link";

export default function PaySuccessPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="mb-4 text-2xl font-semibold">Pagamento riuscito 🎉</h1>
      <p className="mb-6 text-sm text-gray-600">
        Grazie per esserti abbonato a IFindItForYou PRO.
        A breve riceverai una mail di conferma.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        Torna alla home
      </Link>
    </main>
  );
}


