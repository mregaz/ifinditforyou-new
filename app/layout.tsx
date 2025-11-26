// app/layout.tsx
import type { ReactNode } from "react";
import Header from "@/components/Header";

export const metadata = {
  title: "iFindItForYou",
  description: "Ti mando direttamente il link migliore / l’opzione giusta.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
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
      <body>
        {/* HEADER visibile su tutte le pagine */}
        <Header />

        {/* CONTENUTO DELLA PAGINA */}
        {children}
      </body>
    </html>
  );
}

