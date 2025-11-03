// app/page.tsx
export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-4">iFindItForYou</h1>
      <p className="text-gray-500 mb-6">
        Ti mando direttamente il link migliore / l’opzione giusta. Gratis nella fase beta.
      </p>

      <p className="text-sm text-gray-400">
        Vai a <a href="/privacy" className="underline">Privacy</a> –{" "}
        <a href="/terms" className="underline">Termini</a>
      </p>
    </main>
  );
}
