import { Analytics } from '@vercel/analytics/react';
// app/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "iFindItForYou",
  description: "Ti mando direttamente il link migliore / l’opzione giusta.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        {/* stile super semplice per non vedere la pagina tutta attaccata
            (finché non metti Tailwind) */}
        <style>{`
          body {
            margin: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #0f172a;
            color: #e2e8f0;
          }
          a { color: #93c5fd; text-decoration: underline; }
        `}</style>
      </head>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
